import os

EPC_BASE_URL = os.getenv('EPC_BASE_URL', 'https://int.api.ellielabs.com/')
EPC_CLIENT_ID = os.getenv('EPC_CLIENT_ID', None)
EPC_CLIENT_SECRET = os.getenv('EPC_CLIENT_SECRET', None)
EPC_OAUTH_URL = 'oauth2/v1/token'
EPC_ORIGINS_URL = 'partner/v2/origins/'
EPC_TRANSACTIONS_URL = 'partner/v2/transactions/'

USPS_BASE_URL = os.getenv('USPS_BASE_URL', '')
USPS_LOOKUP_URL = os.getenv('USPS_LOOKUP_URL','')
USPS_USER_ID=os.getenv('USPS_USER_ID','')

JWT_ISSUER = 'com.elliemae.epc'
JWT_SECRET = os.getenv('JWT_SECRET', '')
JWT_LIFETIME_SECONDS = 600
JWT_ALGORITHM = 'HS256'

MIMETYPES = {
	'JSON': 'application/json', 
	'FORM': 'application/x-www-form-urlencoded'
}
HMAC_KEY=os.getenv('HMAC_KEY','')

