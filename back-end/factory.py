# Setup the Flask/Connexion Application
import connexion
import logging
from http.client import HTTPConnection
from flask_cors import CORS

from utilities.token_manager import token_manager

log = logging.getLogger('urllib3')  # works
HTTPConnection.debuglevel = 3
log.setLevel(logging.DEBUG)  # needed
fh = logging.FileHandler("requests.log")
log.addHandler(fh)

def create_app():
	# Application Factory
	app = connexion.FlaskApp(
		__name__, 
		specification_dir="specifications/"
	)

	setup_token_manager(app)
	setup_routes(app)
	setup_request_tracker(app)
	add_cors_support(app)

	return app

def setup_token_manager(app):
	# Flask App context is encapsulated with Connexion app object 
	app.app.token_manager = token_manager(
		grant_type = 'client_credentials', 
		scope = 'pc pcapi'
	)

def setup_routes(app):
	# Interpret the API specification
	app.add_api("api.yaml")

def setup_request_tracker(app):
	app.app.request_tracker = dict()
	
def add_cors_support(app):
	CORS(app.app)
