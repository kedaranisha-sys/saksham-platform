import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import init_db
from seed_data import seed_database

# Blueprints
from routes.auth_routes import auth_bp
from routes.jobs_routes import jobs_bp
from routes.resources_routes import resources_bp
from routes.schemes_routes import schemes_bp
from routes.legal_routes import legal_bp
from routes.map_routes import map_bp
from routes.community_routes import community_bp
from routes.mentorship_routes import mentorship_bp
from routes.ai_routes import ai_bp
from routes.admin_routes import admin_bp
from routes.seed_routes import system_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all routes
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Auto-initialize and seed DB if not present
    if not os.path.exists(Config.DATABASE_PATH):
        print("Database not found, initializing and seeding...")
        init_db()
        seed_database()

    # Register API blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(jobs_bp, url_prefix='/api/jobs')
    app.register_blueprint(resources_bp, url_prefix='/api/courses')
    app.register_blueprint(schemes_bp, url_prefix='/api/schemes')
    app.register_blueprint(legal_bp, url_prefix='/api/legal')
    app.register_blueprint(map_bp, url_prefix='/api/locations')
    app.register_blueprint(community_bp, url_prefix='/api/community')
    app.register_blueprint(mentorship_bp, url_prefix='/api/mentors')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(system_bp, url_prefix='/api/system')

    @app.route('/')
    def index():
        return jsonify({
            'platform': 'Saksham – AI-Powered Transgender Empowerment & Support Platform',
            'tagline': 'Empowering Every Identity. Connecting Every Opportunity.',
            'version': '1.0.0',
            'status': 'active',
            'api_base': '/api'
        })

    @app.route('/health')
    def health():
        return jsonify({'status': 'healthy'}), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({'error': 'Resource not found'}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({'error': 'Internal server error', 'details': str(e)}), 500

    return app

app = create_app()

if __name__ == '__main__':
    print(f"Starting Saksham Backend API on port {Config.PORT}...")
    app.run(host='0.0.0.0', port=Config.PORT, debug=Config.DEBUG)
