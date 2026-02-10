import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv('backend/.env')
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

try:
    models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
    print("MODELS_START")
    for m in models[:10]:
        print(m)
    print("MODELS_END")
except Exception as e:
    print(f"ERROR: {e}")
