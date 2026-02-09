import google.generativeai as genai
from typing import Dict, List, Optional
import json
from backend.config import Config

class AIService:
    def __init__(self):
        genai.configure(api_key=Config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')

    def generate_policy(self, client_data: Dict, risk_result: Dict, pricing_result: Dict) -> str:
        """
        Generates a complete insurance policy using Gemini Pro.
        """
        prompt = f"""
        Generate a comprehensive, personalized insurance policy for the following client:
        
        CLIENT DATA:
        {json.dumps(client_data, indent=2)}
        
        RISK ASSESSMENT:
        {json.dumps(risk_result, indent=2)}
        
        PRICING DETAILS:
        {json.dumps(pricing_result, indent=2)}
        
        The policy MUST include:
        1. Policy Overview (Type, Holder, Duration, Coverage Amount)
        2. Detailed Coverage (What is covered)
        3. Terms & Conditions (Standard and personalized based on risk)
        4. Exclusions (What is not covered)
        5. Premium and Payment Schedule (Monthly/Yearly breakdown)
        
        Format the output as a well-structured Markdown document.
        Keep the tone professional, legalistic, yet clear.
        """
        
        response = self.model.generate_content(prompt)
        return response.text

    def refine_policy(self, current_policy: str, refinement_prompt: str) -> str:
        """
        Refines an existing policy based on natural language input.
        """
        prompt = f"""
        You are an insurance expert. I have an existing insurance policy and I want to refine it based on a user's request.
        
        CURRENT POLICY:
        ---
        {current_policy}
        ---
        
        USER REFINEMENT REQUEST: "{refinement_prompt}"
        
        Please update the policy to reflect this request. Ensure the overall structure, legal tone, and consistency are maintained.
        Output ONLY the updated policy text in Markdown.
        """
        
        response = self.model.generate_content(prompt)
        return response.text
