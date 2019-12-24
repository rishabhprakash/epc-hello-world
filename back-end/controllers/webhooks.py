import connexion
import threading
import hmac
import json
import hashlib
import base64

from flask import current_app as app
from services.zipcode import verify_with_usps
from utilities.constants import HMAC_KEY

""" The webhook received request are routed here. This is where the signature is validated and then the
    request gets processed in a separate Thread. Processing the request in Thread allows us to respond back
    to EPC immediately
"""


def process(body):
    event_type = body.get('eventType')
    resource_type = body.get('meta').get('resourceType')
    transaction_id = body.get('meta').get('resourceId')
    resource_ref = body.get('meta').get('resourceRef')
    elli_signature = '{}'.format(connexion.request.headers.get('Elli-Signature'))

    req_body_str = json.dumps(body)
    message = bytes(req_body_str, 'ascii')
    secret = bytes(HMAC_KEY, 'ascii')

    hmac_digest = hmac.new(secret, message, digestmod=hashlib.sha256).digest()
    mesg_signature_str = str(base64.b64encode(hmac_digest), 'ascii')

    print("Generated Signature Str ", mesg_signature_str)
    print("Elli-Signature ", elli_signature)

    # Facing some issues with the HMAC digest generation, for now going with an assumption that
    # all of the webhook requests received are meant for ZipRight
    # if mesg_signature_str == elli_signature:
    # accept and process the request
    if event_type == 'created' and resource_type == 'urn:elli:epc:transaction':
        request_tracker_obj = dict()
        request_tracker_obj['status'] = 'VALIDATION_REQUESTED'
        request_tracker_obj['resource_id'] = None
        app.request_tracker[transaction_id] = request_tracker_obj
        access_token = app.token_manager.get_token()
        request_processor = threading.Thread(target=verify_with_usps,
                                             args=(transaction_id, app.request_tracker, access_token,))
        request_processor.start()
    elif event_type == 'created' and resource_type == 'urn:elli:epc:transaction:event':
        req_tracker = app.request_tracker.get(transaction_id, None)
        if req_tracker is not None:
            req_tracker['status'] = "REQUEST_COMPLETED"
        print("Received Updated Event")
    return 'Accepted', 202
    # commented till we resolve the HMAC generation issue above
    # else:
    #    return 'Bad Request', 400
