from flask import Blueprint, request, jsonify
from backend.services.pricing_engine import PricingEngine

pricing_bp = Blueprint('pricing', __name__)
pricing_engine = PricingEngine()

@pricing_bp.route('/calculate', methods=['POST'])
def calculate_pricing():
    data = request.json
    risk_score = data.get('risk_score', 'Medium')
    coverage_amount = data.get('coverage_amount', 100000)
    insurance_type = data.get('insurance_type', 'life')
    
    result = pricing_engine.calculate_pricing(risk_score, coverage_amount, insurance_type)
    return jsonify(result.dict()), 200
