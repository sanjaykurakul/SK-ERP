from flask import Flask, jsonify, render_template
from flask_cors import CORS
from config import Config
import mysql.connector

def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config.from_object(Config)

    # Enable CORS
    CORS(app)

    # Database Connection Function
    def get_db_connection():
        try:
            connection = mysql.connector.connect(
                host=app.config['DB_HOST'],
                user=app.config['DB_USER'],
                password=app.config['DB_PASSWORD'],
                database=app.config['DB_NAME']
            )
            return connection
        except Exception as e:
            print(f"Error connecting to database: {e}")
            return None

    # Attach DB connection function to app so routes can use it
    app.get_db_connection = get_db_connection

    # Register Blueprints
    from routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')

    # Serve Frontend Pages
    @app.route('/')
    def login():
        return render_template('login.html')

    @app.route('/dashboard')
    def dashboard():
        return render_template('dashboard.html')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
