import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'saksham-empowerment-secure-secret-2026')
    DATABASE_PATH = os.path.join(BASE_DIR, 'saksham.db')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', '*').split(',')
    DEBUG = os.getenv('FLASK_DEBUG', 'True').lower() in ('true', '1', 't')
    PORT = int(os.getenv('PORT', 5000))
