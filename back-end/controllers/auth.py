import time

import connexion
import six
from werkzeug.exceptions import Unauthorized

from jose import JWTError, jwt

from utilities.constants import JWT_ISSUER, JWT_SECRET, JWT_ALGORITHM, JWT_LIFETIME_SECONDS


def generate_token(body):

	# TODO - Get credentials from origin for authentication - services.origin
	if (body.get('username') == "rprakash" and 
		body.get('password') == "password" and 
		body.get('grant_type') == "password"):

		timestamp = _current_timestamp()
		jwt_payload = {
			"iss": JWT_ISSUER,
			"iat": int(timestamp),
			"exp": int(timestamp + JWT_LIFETIME_SECONDS),
			"sub": str(body.get('username'))
		}

		response = {
			"access_token": jwt.encode(jwt_payload, JWT_SECRET, algorithm=JWT_ALGORITHM),
			"token_type": "Bearer",
			"expires_in": int(timestamp + JWT_LIFETIME_SECONDS)
		}

		return response, 200
	else:
		return 401

def decode_token(token):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except JWTError as e:
        six.raise_from(Unauthorized, e)
			
			
def _current_timestamp() -> int:
	return int(time.time())