import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

env_path = os.path.join('backend', '.env')
load_dotenv(env_path)

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

models_list = []
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            models_list.append(m.name)
    with open('models_output.json', 'w') as f:
        json.dump(models_list, f)
    print("SUCCESS")
except Exception as e:
    print(f"Error: {e}")
