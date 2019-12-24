import connexion

from flask import current_app as app

# Origins retrieve controller
def retrieve(id):

	res = dict()
	if app.request_tracker.get(id, None) != None:
		req_tracker = app.request_tracker.get(id, 'None')
		res['status'] = req_tracker.get('status', 'None')
		res['resource_id'] = req_tracker.get('resource_id', 'None')
	else:
		return 404

	return res, 200