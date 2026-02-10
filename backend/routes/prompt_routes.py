from flask import Blueprint, request, jsonify
from services.ai_service import AIService
from models.supabase_models import SupabaseModels

prompt_bp = Blueprint('prompt', __name__)

ai_service = AIService()
db = SupabaseModels()

@prompt_bp.route('/refine', methods=['POST'])
def refine_policy():
    data = request.json
    policy_id = data.get('policy_id')
    refinement_prompt = data.get('prompt')
    current_policy_text = data.get('current_text') # In real app, fetch from DB
    
    # 1. AI Refinement
    updated_policy_text = ai_service.refine_policy(current_policy_text, refinement_prompt)
    
    # 2. Persistence
    db.log_prompt(policy_id, refinement_prompt)
    db.save_policy_version(policy_id, updated_policy_text, version_note=f"Refinement: {refinement_prompt[:30]}...")
    
    return jsonify({
        "policy_id": policy_id,
        "updated_policy_text": updated_policy_text
    }), 200
