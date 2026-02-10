import google.generativeai as genai
import os
from dotenv import load_dotenv

# Path to the .env file in the backend directory
env_path = os.path.join('backend', '.env')
load_dotenv(env_path)

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

print("CONFIRMED_MODELS_START")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
except Exception as e:
    print(f"Error: {e}")
print("CONFIRMED_MODELS_END")
