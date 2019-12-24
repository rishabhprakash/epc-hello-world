import requests
import logging
from requests.exceptions import HTTPError

import json

from utilities.constants import MIMETYPES

def get(url: object, headers: object = None, parameters: object = None) -> object:

	try:
		res = requests.get(url, headers = headers, params = parameters)

		# If the response was successful, no Exception will be raised
		res.raise_for_status()

	except HTTPError as http_err:
		print ('HTTP error occurred:' + '{}'.format(http_err))

	except ConnectionError as connection_err:
		print ('A network problem occurred:' + '{}'.format(connection_err))
		
	except Exception as err:
		print ('Other error occurred:' '{}'.format(err))

	print(res.status_code)
	print(res.text)
	return res



def post(url, content_type, body, headers = None, parameters = None) -> dict:

	try:
		if (content_type == MIMETYPES.get('JSON')):
			res = requests.post(url, headers = headers, params = parameters, json = body)
		elif (content_type == MIMETYPES.get('FORM')):
			res = requests.post(url, headers = headers, params = parameters, data = body)

		# If the response was successful, no Exception will be raised
		res.raise_for_status()

	except HTTPError as http_err:
		print ('HTTP error occurred:' + '{}'.format(http_err))

	except ConnectionError as connection_err:
		print ('A network problem occurred:' + '{}'.format(connection_err))
		
	except Exception as err:
		print ('Other error occurred:' '{}'.format(err))

	print(res.status_code)
	print(res.text)
	return res


def patch(url, content_type, body, headers=None, parameters=None) -> dict:

	try:
		if (content_type == MIMETYPES.get('JSON')):
			res = requests.patch(url, headers=headers, params=parameters, json=body)
		elif (content_type == MIMETYPES.get('FORM')):
			res = requests.patch(url, headers=headers, params=parameters, data=body)

		# If the response was successful, no Exception will be raised
		res.raise_for_status()

	except HTTPError as http_err:
		print('HTTP error occurred:' + '{}'.format(http_err))

	except ConnectionError as connection_err:
		print('A network problem occurred:' + '{}'.format(connection_err))

	except Exception as err:
		print('Other error occurred:' '{}'.format(err))

	print(res.status_code)
	print(res.text)
	return res

def put_file(url, file_name, headers=None, parameters=None) -> dict:

	stream = open(file_name, 'rb')
	files = {'file': stream}

	try:
		res = requests.put(url, headers=headers, params=parameters, data=files)

		# If the response was successful, no Exception will be raised
		res.raise_for_status()

	except HTTPError as http_err:
		print('HTTP error occurred:' + '{}'.format(http_err))

	except ConnectionError as connection_err:
		print('A network problem occurred:' + '{}'.format(connection_err))

	except Exception as err:
		print('Other error occurred:' '{}'.format(err))

	print(res.status_code)
	print(res.text)
	return res
