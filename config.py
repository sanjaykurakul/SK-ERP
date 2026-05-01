import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'super-secret-key-for-erp-mini'
    
    # Database Configuration
    # You can override these with environment variables
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_USER = os.environ.get('DB_USER', 'root')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', '') # Empty by default, adjust if needed
    DB_NAME = os.environ.get('DB_NAME', 'erp_db')
