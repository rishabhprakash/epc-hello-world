import time

from utilities.constants import EPC_BASE_URL, EPC_CLIENT_ID, EPC_CLIENT_SECRET, EPC_OAUTH_URL, MIMETYPES
from utilities.http import post


class token_manager:
    def __init__(self, grant_type, scope):
        self.url = EPC_BASE_URL + EPC_OAUTH_URL
        self.client_id = EPC_CLIENT_ID
        self.client_secret = EPC_CLIENT_SECRET
        self.grant_type = grant_type
        self.scope = scope

        self.access_token = ""
        self.expiry = None

        self.create_token()

    def create_token(self):
        if self.client_secret is not None and self.client_id is not None:
            body = {
                'grant_type': self.grant_type,
                'client_id': self.client_id,
                'client_secret': self.client_secret,
                'scope': self.scope
            }

            content_type = MIMETYPES.get('FORM')
            response = post(url=self.url, content_type=content_type, body=body)

            if response is not None:
                response_obj = response.json()
                self.access_token = response_obj.get('access_token')
                self.expiry = time.time() + 900
                return True

        return False

    def get_token(self) -> str:
        current_time = time.time()

        if current_time >= self.expiry:
            self.create_token()

        return self.access_token
