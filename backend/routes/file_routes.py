from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
import os
import PyPDF2
import docx

file_bp = Blueprint('files', __name__)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_text_from_pdf(filepath):
    """Extract text from PDF file"""
    try:
        with open(filepath, 'rb') as file:
            pdf_reader = PyPDF2.PdfReader(file)
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            return text
    except Exception as e:
        print(f"Error extracting PDF: {e}")
        return None

def extract_text_from_docx(filepath):
    """Extract text from DOCX file"""
    try:
        doc = docx.Document(filepath)
        text = ""
        for paragraph in doc.paragraphs:
            text += paragraph.text + "\n"
        return text
    except Exception as e:
        print(f"Error extracting DOCX: {e}")
        return None

@file_bp.route('/upload', methods=['POST'])
def upload_file():
    """Handle file upload for existing policies"""
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Only PDF and DOC files are allowed'}), 400
    
    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)
    
    # Extract text based on file type
    file_ext = filename.rsplit('.', 1)[1].lower()
    
    if file_ext == 'pdf':
        policy_text = extract_text_from_pdf(filepath)
    elif file_ext in ['doc', 'docx']:
        policy_text = extract_text_from_docx(filepath)
    else:
        return jsonify({'error': 'Unsupported file format'}), 400
    
    if not policy_text:
        return jsonify({'error': 'Failed to extract text from file'}), 500
    
    # Clean up uploaded file
    os.remove(filepath)
    
    # Mock analysis of the uploaded policy for UI consistency
    # In a real app, we would use NLP to extract these values
    risk_assessment = {
        "score": "Low",
        "factors": ["Existing Policy Holder", "Verified Documents"]
    }
    
    pricing = {
        "monthly_premium": 0,  # Placeholder
        "yearly_premium": 0,   # Placeholder
        "coverage_amount": 0   # Placeholder
    }
    
    # Try to extract coverage amount if possible (simple regex)
    import re
    coverage_match = re.search(r'\$?(\d{1,3}(,\d{3})*(\.\d{2})?)', policy_text)
    if coverage_match:
        try:
            amount_str = coverage_match.group(1).replace(',', '')
            pricing["coverage_amount"] = float(amount_str)
        except:
            pass

    return jsonify({
        "success": True,
        "policy_id": f"UPLOAD-{os.urandom(4).hex()}",
        "risk_assessment": risk_assessment,
        "pricing": pricing,
        "policy_text": policy_text,
        "insurance_details": {"type": "Existing Policy"}
    }), 200
