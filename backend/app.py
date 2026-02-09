from flask import Flask
from flask_cors import CORS
from backend.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)

    # Register blueprints
    from backend.routes.policy_routes import policy_bp
    from backend.routes.risk_routes import risk_bp
    from backend.routes.pricing_routes import pricing_bp
    from backend.routes.prompt_routes import prompt_bp

    app.register_blueprint(policy_bp, url_prefix='/api/policies')
    app.register_blueprint(risk_bp, url_prefix='/api/risk')
    app.register_blueprint(pricing_bp, url_prefix='/api/pricing')
    app.register_blueprint(prompt_bp, url_prefix='/api/prompts')

    @app.route('/health')
    def health_check():
        return {'status': 'healthy'}, 200

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)
