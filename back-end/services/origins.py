from flask import current_app as app

from utilities.http import get, post
from utilities.constants import EPC_BASE_URL, EPC_ORIGINS_URL

# Internal function to pull down Origin information
def _get_origin(id, partnerAccessToken) -> dict:

	# Ask token_manager for current oAuth token
	access_token = app.token_manager.get_token()

	url = EPC_BASE_URL + EPC_ORIGINS_URL + id
	headers = {
		'Authorization': 'Bearer' + ' ' + access_token,
		'X-Elli-PAT': partnerAccessToken
	}
	response = get(url = url, headers = headers)

	return response

# Retrieve service credentials associated with originating user
def get_credentials(id, partnerAccessToken) -> dict:

	origin_data = _get_origin(id, partnerAccessToken)

	if origin_data.status_code == 200:
		origin_data_obj = origin_data.json()
		credentials = origin_data_obj.get("credentials", None)
	return credentials

# Retrieve subject property information associated with current loan
def get_property_information(id, partnerAccessToken) -> dict:

	response = dict()
	origin_data = _get_origin(id, partnerAccessToken)
	if origin_data.status_code == 200:
		origin_data_obj = origin_data.json()
		if origin_data_obj.get("loan", None) != None:
			loan_information = origin_data_obj.get("loan", None)
			property_information = loan_information.get("property", None)
			return property_information
		elif origin_data_obj.get('errors', None) != None:
			response['errors'] = origin_data_obj.get('errors', None)
			return response
	else:
		response['errors'] = origin_data.status_code
		return response

# Retrieve loan information using the origin id and partner access token received from the front end
def get_loan_information(id, partnerAccessToken) -> dict:

	response = dict()
	origin_data = _get_origin(id, partnerAccessToken)
	if origin_data.status_code == 200:
		origin_data_obj = origin_data.json()
		if origin_data_obj.get("loan", None) != None:
			loan_information = origin_data_obj.get("loan", None)
			return loan_information
		elif origin_data_obj.get('errors', None) != None:
			response['errors'] = origin_data_obj.get('errors', None)
			return response
		else:
			response['errors'] = "Loan Object not found"
			return response
	else:
		response['errors'] = origin_data.status_code
		return response

