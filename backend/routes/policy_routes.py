from flask import Blueprint, request, jsonify, send_file
import os
from backend.services.risk_engine import RiskEngine
from backend.services.pricing_engine import PricingEngine
from backend.services.ai_service import AIService
from backend.models.supabase_models import SupabaseModels

policy_bp = Blueprint('policy', __name__)

risk_engine = RiskEngine()
pricing_engine = PricingEngine()
ai_service = AIService()
db = SupabaseModels()

@policy_bp.route('/', methods=['POST'])
def create_policy():
    data = request.json
    client_data = data.get('client_details', {})
    insurance_details = data.get('insurance_details', {})
    
    # 1. Risk Assessment
    risk_result = risk_engine.calculate_risk(client_data)
    
    # 2. Pricing Calculation
    pricing_result = pricing_engine.calculate_pricing(
        risk_score=risk_result.score,
        coverage_amount=insurance_details.get('coverage_amount', 100000),
        insurance_type=insurance_details.get('type', 'life')
    )
    
    # 3. AI Policy Generation
    policy_text = ai_service.generate_policy(
        client_data=client_data,
        risk_result=risk_result.dict(),
        pricing_result=pricing_result.dict()
    )
    
    # 4. Persistence (Mocked or Real Supabase)
    user = db.create_user(client_data)
    policy = db.create_policy(user.get('id'), insurance_details)
    db.save_risk_assessment(policy['id'], risk_result.dict())
    db.save_pricing(policy['id'], pricing_result.dict())
    db.save_policy_version(policy['id'], policy_text)
    
    return jsonify({
        "policy_id": policy['id'],
        "risk_assessment": risk_result.dict(),
        "pricing": pricing_result.dict(),
        "policy_text": policy_text
    }), 201

from backend.utils.exporters import Exporter
from flask import send_file

exporter = Exporter()

@policy_bp.route('/<policy_id>/export', methods=['POST'])
def export_policy(policy_id):
    data = request.json
    format = data.get('format', 'pdf')
    policy_text = data.get('policy_text')
    
    if format == 'pdf':
        filepath = exporter.export_to_pdf(policy_text, f"policy_{policy_id}")
    else:
        filepath = exporter.export_to_docx(policy_text, f"policy_{policy_id}")
    
    return send_file(os.path.abspath(filepath), as_attachment=True)
