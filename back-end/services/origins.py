from flask import current_app as app

from utilities.http import get, post
from utilities.constants import EPC_BASE_URL, EPC_ORIGINS_URL

"""" Internal function to pull down Origin information """


def _get_origin(origin_id, partner_access_token) -> dict:
    # Ask token_manager for current oAuth token
    access_token = app.token_manager.get_token()

    url = EPC_BASE_URL + EPC_ORIGINS_URL + origin_id
    headers = {
        'Authorization': 'Bearer' + ' ' + access_token,
        'X-Elli-PAT': partner_access_token
    }
    response = get(url=url, headers=headers)

    return response


""" Internal function does hard coded user name password validation, 
    but this is where a Production app can implement their own authentication scheme
"""


def validate_credentials(origin_data_obj) -> dict:
    credentials = origin_data_obj.get("credentials", None)
    username = credentials.get('username', None)
    password = credentials.get('password', None)

    if username == "dummy_username" and password == "dummy_password":
        return True
    else:
        return False


""" Retrieve subject property information associated with current loan """


def get_property_information(origin_id, partner_access_token) -> dict:
    response = dict()
    origin_data = _get_origin(origin_id, partner_access_token)
    if origin_data.status_code == 200:
        origin_data_obj = origin_data.json()
        if origin_data_obj.get("loan", None) is not None:
            loan_information = origin_data_obj.get("loan", None)
            property_information = loan_information.get("property", None)
            return property_information
        elif origin_data_obj.get('errors', None) is not None:
            response['errors'] = origin_data_obj.get('errors', None)
            return response
    else:
        response['errors'] = origin_data.status_code
        return response


""" Retrieve loan information using the origin id and partner access token received from the front end """


def get_loan_information(origin_id, partner_access_token) -> dict:
    response = dict()
    origin_data = _get_origin(origin_id, partner_access_token)
    if origin_data.status_code == 200:
        origin_data_obj = origin_data.json()
        if validate_credentials(origin_data_obj) is True:
            if origin_data_obj.get("loan", None) is not None:
                loan_information = origin_data_obj.get("loan", None)
                return loan_information
            elif origin_data_obj.get('errors', None) is not None:
                response['errors'] = origin_data_obj.get('errors', None)
                return response
            else:
                response['errors'] = "Loan Object not found"
                return response
        else:
            return False
    else:
        response['errors'] = origin_data.status_code
        return response
