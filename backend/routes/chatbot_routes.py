from flask import Blueprint, request, jsonify
from services.ai_service import AIService

chatbot_bp = Blueprint('chatbot', __name__)
ai_service = AIService()

@chatbot_bp.route('/query', methods=['POST'])
def chatbot_query():
    """Handle chatbot queries with policy context"""
    data = request.json
    
    if not data or 'question' not in data or 'policy_context' not in data:
        return jsonify({'error': 'Missing question or policy context'}), 400
    
    question = data['question']
    policy_context = data['policy_context']
    
    # Create a context-aware prompt
    prompt = f"""You are an insurance policy assistant. Answer the following question based ONLY on the provided policy context. 
    
Policy Context:
{policy_context}

Question: {question}

Instructions:
- Only answer based on the policy context provided
- If the answer is not in the policy, say "This information is not available in the provided policy"
- Be concise and professional
- Do not make assumptions or provide general insurance advice

Answer:"""
    
    try:
        response = ai_service._generate_with_retry(prompt)
        return jsonify({
            'success': True,
            'answer': response
        }), 200
    except Exception as e:
        print(f"Chatbot error: {e}")
        return jsonify({
            'success': False,
            'error': 'Unable to process your question at this time'
        }), 500
