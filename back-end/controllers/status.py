from flask import current_app as app

""""" Status retrieve controller, the v1/status/{{transaction_id}} request gets routed here
 The function responds back with the status of the transaction and resource id of the document if uploaded successfully """


def retrieve(transaction_id):
    res = dict()
    if app.request_tracker.get(transaction_id, None) is not None:
        req_tracker = app.request_tracker.get(transaction_id, 'None')
        res['status'] = req_tracker.get('status', 'None')
        res['resource_id'] = req_tracker.get('resource_id', 'None')
    else:
        print("Did not find status for the received transaction_id: ", transaction_id)
        return 401

    return res, 200
