from factory import create_app

# Making .env variables available in the environment
from dotenv import load_dotenv
load_dotenv()

# Create an instance of the connexion application
app = create_app()

# If in stand alone mode, execute at port 8080
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)

