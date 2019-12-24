from flask import current_app as app

from utilities.http import get, post, patch, put_file
from utilities.constants import EPC_BASE_URL, EPC_TRANSACTIONS_URL, MIMETYPES

LOAN_FORMAT = "application/vnd.plm-2.0.0+json"

"""" retrieves property information by calling EPC transaction service """


def get_property_data(transaction_id, access_token="") -> dict:
    # If access token not provider then ask token_manager for current oAuth token
    if not access_token:
        access_token = app.token_manager.get_token()

    url = EPC_BASE_URL + EPC_TRANSACTIONS_URL + transaction_id
    headers = {
        "Authorization": "Bearer" + " " + access_token
    }

    response = get(url=url, headers=headers)
    if response.status_code == 200:
        response_obj = response.json()
        epc_request_object = response_obj.get("request", None)
        loan_object = epc_request_object.get("loan", None)
        property_object = loan_object.get("property", None)
    else:
        return False

    return property_object


"""" posts the updated loan data to EPC """


def post_response(status, property_information, transaction_id, access_token="") -> dict:
    # If access token not provider then ask token_manager for current oAuth token
    if not access_token:
        access_token = app.token_manager.get_token()

    url = EPC_BASE_URL + EPC_TRANSACTIONS_URL + transaction_id + "/response"
    headers = {
        "Authorization": "Bearer" + " " + access_token
    }

    content_type = MIMETYPES.get("JSON")
    payload = {
        "status": status,
        "partnerStatus": "Inspection Scheduled",
        "referenceNumber": "CXV90345",
        "respondingParty": {
            "name": "AddressVerify Corp.",
            "address": "P.O. BOX 509124, SUITE 300",
            "city": "SAN DIEGO",
            "state": "CA",
            "postalCode": "92150",
            "pointOfContact": {
                "name": "John Doe",
                "role": "Manager",
                "phone": "8009864343",
                "email": "john_doe@partner.com"
            }
        },
        "loanFormat": LOAN_FORMAT,
        "loan": {
            "property": property_information
        }
    }

    response = patch(url=url, content_type=content_type, headers=headers, body=payload)
    return response


def update_transaction_resource(status, resource_id, file_name, mime_type, transaction_id, access_token=""):
    if not access_token:
        access_token = app.token_manager.get_token()

    url = EPC_BASE_URL + EPC_TRANSACTIONS_URL + transaction_id + "/response"
    headers = {
        "Authorization": "Bearer" + " " + access_token
    }

    content_type = MIMETYPES.get("JSON")
    payload = {
        "status": status,
        "resources": [
            {
                "id": resource_id,
                "name": file_name,
                "mimeType": mime_type
            }
        ]
    }
    response = patch(url=url, content_type=content_type, headers=headers, body=payload)
    return response


""" internal function that prepares the resource transactions """


def _prepare_upload_file(file_name, transaction_id, access_token=""):
    if not access_token:
        access_token = app.token_manager.get_token()

    url = EPC_BASE_URL + EPC_TRANSACTIONS_URL + transaction_id + "/response/resources"
    headers = {
        "Authorization": "Bearer" + " " + access_token,
    }

    content_type = MIMETYPES.get("JSON")
    payload = [
        {
            "name": file_name,
            "mimeType": "application/pdf"
        }
    ]

    response = post(url=url, content_type=content_type, headers=headers, body=payload)

    return response


""" function to upload the PDF doc to EPC """


def upload_file(file_name, transaction_id, access_token):
    prepare_upload_rsp = _prepare_upload_file(file_name, transaction_id, access_token)

    if prepare_upload_rsp.status_code == 200:
        prepare_upload_rsp_obj = prepare_upload_rsp.json()
        resource_id = prepare_upload_rsp_obj[0].get("id", None)
        partner_resource_location = prepare_upload_rsp_obj[0].get("location", None)
        partner_resource_authorization_header = prepare_upload_rsp_obj[0].get("authorization", None)
        partner_resource_mimeType = prepare_upload_rsp_obj[0].get("mimeType", None)
        partner_file_name = prepare_upload_rsp_obj[0].get("name", None)

    headers = {
        "Authorization": partner_resource_authorization_header,
        "Content-Type": partner_resource_mimeType
    }

    url = partner_resource_location

    response = put_file(url, file_name, headers=headers)

    if response.status_code == 200:
        update_resource_response = update_transaction_resource('completed', resource_id, partner_file_name,
                                                               partner_resource_mimeType, transaction_id, access_token)
        if update_resource_response.status_code == 200:
            return resource_id

    return None
