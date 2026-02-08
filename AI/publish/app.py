import sys
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask
from flask_cors import CORS

# Import all API modules
from api_credit import credit_bp
from api_banking import banking_bp
from api_forecast import forecast_bp
from api_categorize import categorize_bp
from api_kyc import kyc_bp
from api_churn import churn_bp

# Create Flask app
app = Flask(__name__, static_folder='.', static_url_path='')
app.config['JSON_SORT_KEYS'] = False

# Configure CORS
cors_origins = os.getenv('CORS_ORIGINS', '*')
CORS(app, origins=cors_origins.split(',') if cors_origins != '*' else '*')

# Register Blueprints
app.register_blueprint(credit_bp)
app.register_blueprint(banking_bp)
app.register_blueprint(forecast_bp)
app.register_blueprint(categorize_bp)
app.register_blueprint(kyc_bp)
app.register_blueprint(churn_bp)

@app.route('/', methods=['GET'])
def health_check():
    return {
        "status": "online",
        "message": "Asper AI Banking System is running",
        "endpoints": [
            "/api/v1/credit/predict",
            "/api/v1/banking/analyze",
            "/api/v1/banking/forecast",
            "/api/v1/banking/categorize",
            "/api/v1/kyc/verify-document",
            "/api/v1/crm/churn-risk"
        ]
    }

if __name__ == '__main__':
    # Get configuration from environment variables
    debug = os.getenv('FLASK_DEBUG', 'False').lower() == 'true'
    host = os.getenv('HOST', '0.0.0.0')
    port = int(os.getenv('PORT', 5001))
    
    print(f"Starting Flask server on http://{host}:{port}")
    print(f"Debug Mode: {debug}")
    print(f"Dashboard: http://{host}:{port}/dashboard.html")
    
    app.run(debug=debug, host=host, port=port)
