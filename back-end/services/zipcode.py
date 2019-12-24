import requests
import xml.etree.ElementTree as ET

from datetime import date
from fpdf import FPDF
from services.transactions import get_property_data, upload_file, post_response
from utilities.constants import USPS_BASE_URL, USPS_LOOKUP_URL, USPS_USER_ID

""" Here we call USPS ZIpCode validator service, parse the response and
    and call EPC services to update results as well as upload a generated PDF
"""


def verify_with_usps(transaction_id, request_tracker, access_token):  # -> dict:

    request_tracker[transaction_id]['status'] = "VALIDATION_STARTED"
    propertyObject = get_property_data(transaction_id, access_token)
    if propertyObject is False:
        request_tracker[transaction_id]['status'] = "VALIDATION_FAILED"
        return False

    # time.sleep(1)

    zipcode = propertyObject.get("postalCode")

    url = USPS_BASE_URL + USPS_LOOKUP_URL
    data = f"""<CityStateLookupRequest USERID="{USPS_USER_ID}">
			<ZipCode ID="0">
				<Zip5>{zipcode}</Zip5>
			</ZipCode>
		</CityStateLookupRequest>"""

    params = {
        "API": "CityStateLookup",
        "XML": data
    }

    headers = {
        'Accept': "*/*",
        'Cache-Control': "no-cache",
        'Accept-Encoding': "gzip, deflate",
        'cache-control': "no-cache"
    }

    response = requests.request("GET", url, headers=headers, params=params)

    if response.status_code == 200:
        response_tree = ET.fromstring(response.text)
        for ZipCode in response_tree:
            for child in ZipCode:
                if child.tag == "Zip5":
                    validatedZip = child.text
                if child.tag == "City":
                    validatedCity = child.text
                if child.tag == "State":
                    validatedState = child.text
    else:
        request_tracker[transaction_id]['status'] = "PROCESSING_ERROR"
        return False

    file_name = _generate_pdf(validatedCity=validatedCity, validatedState=validatedState, validatedZip=validatedZip,
                              validatedCounty="")

    # posting the results to EPC server
    propertyObject['city'] = validatedCity
    propertyObject['state'] = validatedState

    epc_post_rsp = post_response('processing', propertyObject, transaction_id, access_token)
    if epc_post_rsp.status_code == 200:
        request_tracker[transaction_id]['status'] = "VALIDATION_UPDATED"
    else:
        request_tracker[transaction_id]['status'] = "VALIDATION_UPDATE_FAILED"
        return False

    resource_id = upload_file(file_name, transaction_id, access_token)

    if resource_id is not None:
        request_tracker[transaction_id]['status'] = "DOCUMENT_UPLOADED"  # assuming it
        request_tracker[transaction_id]['resource_id'] = resource_id
    else:
        request_tracker[transaction_id]['status'] = "DOCUMENT_UPLOAD_FAILED"  # assuming it

    return True


""" Internal function that uses FPDF library to generate a simple PDF file """


def _generate_pdf(validatedCity, validatedState, validatedZip, validatedCounty=""):
    epc_pdf = FPDF()
    epc_pdf.add_page()
    epc_pdf.set_font("Arial", size=12)
    file_name = "ZipcodeValidationResults-" + date.today().strftime("%m-%d-%Y") + ".pdf"
    epc_pdf.cell(200, 10, txt="Zipcode Validation Results", ln=1, align="C")
    if validatedCity:
        epc_pdf.cell(200, 10, txt="City:	" + validatedCity, ln=1, align="L")
    if validatedState:
        epc_pdf.cell(200, 10, txt="State:	" + validatedState, ln=1, align="L")
    if validatedCounty:
        epc_pdf.cell(200, 10, txt="County:	" + validatedCounty, ln=1, align="L")
    if validatedZip:
        epc_pdf.cell(200, 10, txt="Zip:	" + validatedZip, ln=1, align="L")

    epc_pdf.output(file_name)

    return file_name
