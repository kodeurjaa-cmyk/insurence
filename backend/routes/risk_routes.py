from flask import Blueprint, request, jsonify
from services.risk_engine import RiskEngine

risk_bp = Blueprint('risk', __name__)
risk_engine = RiskEngine()

@risk_bp.route('/analyze', methods=['POST'])
def analyze_risk():
    data = request.json
    client_data = data.get('client_details', {})
    result = risk_engine.calculate_risk(client_data)
    return jsonify(result.dict()), 200
