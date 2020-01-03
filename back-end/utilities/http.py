import requests
from requests.exceptions import HTTPError

from utilities.constants import MIMETYPES

""" wrapper method for requests.get call for simplicity and ease of debugging """


def get(url: object, headers: object = None, parameters: object = None) -> object:
    res = None
    try:
        res = requests.get(url, headers=headers, params=parameters)

        # If the response was successful, no Exception will be raised
        res.raise_for_status()

    except HTTPError as http_err:
        print('HTTP error occurred:' + '{}'.format(http_err))

    except ConnectionError as connection_err:
        print('A network problem occurred:' + '{}'.format(connection_err))

    except Exception as err:
        print('Other error occurred:' '{}'.format(err))

    if res is not None:
        print(res.status_code)
        print(res.text)
    return res


""" wrapper method for requests.post call for simplicity and ease of debugging """


def post(url, content_type, body, headers=None, parameters=None) -> dict:
    res = None
    try:
        if content_type == MIMETYPES.get('JSON'):
            res = requests.post(url, headers=headers,
                                params=parameters, json=body)
        elif content_type == MIMETYPES.get('FORM'):
            res = requests.post(url, headers=headers,
                                params=parameters, data=body)

        # If the response was successful, no Exception will be raised
        res.raise_for_status()

    except HTTPError as http_err:
        print('HTTP error occurred:' + '{}'.format(http_err))

    except ConnectionError as connection_err:
        print('A network problem occurred:' + '{}'.format(connection_err))

    except Exception as err:
        print('Other error occurred:' '{}'.format(err))

    if res is not None:
        print(res.status_code)
        print(res.text)
    return res


""" wrapper method for requests.post call for simplicity and ease of debugging """


def patch(url, content_type, body, headers=None, parameters=None) -> dict:
    res = None
    try:
        if content_type == MIMETYPES.get('JSON'):
            res = requests.patch(url, headers=headers,
                                 params=parameters, json=body)
        elif content_type == MIMETYPES.get('FORM'):
            res = requests.patch(url, headers=headers,
                                 params=parameters, data=body)

        # If the response was successful, no Exception will be raised
        res.raise_for_status()

    except HTTPError as http_err:
        print('HTTP error occurred:' + '{}'.format(http_err))

    except ConnectionError as connection_err:
        print('A network problem occurred:' + '{}'.format(connection_err))

    except Exception as err:
        print('Other error occurred:' '{}'.format(err))

    if res is not None:
        print(res.status_code)
        print(res.text)
    return res


""" wrapper method for requests.put call for simplicity and ease of debugging
    used mainly for uploading the PDF file generated after validation
"""


def put_file(url, file_name, headers=None, parameters=None) -> dict:
    res = None
    fileContent = None

    with open(file_name, mode='rb') as file:
        fileContent = file.read()

    try:
        res = requests.put(url, headers=headers,
                           params=parameters, data=fileContent)

        # If the response was successful, no Exception will be raised
        res.raise_for_status()

    except HTTPError as http_err:
        print('HTTP error occurred:' + '{}'.format(http_err))

    except ConnectionError as connection_err:
        print('A network problem occurred:' + '{}'.format(connection_err))

    except Exception as err:
        print('Other error occurred:' '{}'.format(err))

    if res is not None:
        print(res.status_code)
        print(res.text)
    return res
