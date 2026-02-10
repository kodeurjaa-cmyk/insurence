import google.generativeai as genai
from typing import Dict
import json
import time
from config import Config

class AIService:
    def __init__(self):
        genai.configure(api_key=Config.GEMINI_API_KEY)
        # List of models to try in order (from cheapest to most expensive)
        self.model_names = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest']
        self.current_model_index = 0
        self.model = genai.GenerativeModel(self.model_names[0])
    
    def _generate_with_retry(self, prompt: str, max_retries: int = 3) -> str:
        """
        Attempts to generate content with retry logic and model fallback.
        """
        last_error = None
        
        for model_name in self.model_names:
            try:
                model = genai.GenerativeModel(model_name)
                print(f"Attempting generation with model: {model_name}")
                
                for attempt in range(max_retries):
                    try:
                        response = model.generate_content(prompt)
                        print(f"Successfully generated content with {model_name}")
                        return response.text
                    except Exception as e:
                        error_str = str(e)
                        print(f"Attempt {attempt + 1} failed with {model_name}: {error_str}")
                        
                        # If it's a quota error, try next model immediately
                        if "quota" in error_str.lower() or "429" in error_str:
                            print(f"Quota exceeded for {model_name}, trying next model...")
                            break
                        
                        # For other errors, retry with exponential backoff
                        if attempt < max_retries - 1:
                            wait_time = 2 ** attempt
                            print(f"Retrying in {wait_time} seconds...")
                            time.sleep(wait_time)
                        
                        last_error = e
                        
            except Exception as e:
                print(f"Error initializing model {model_name}: {e}")
                last_error = e
                continue
        
        # If all models fail, return a detailed mock policy
        print("All models failed. Returning mock policy.")
        return self._generate_mock_policy(prompt)
    
    def _generate_mock_policy(self, prompt: str) -> str:
        """
        Generates a realistic mock policy when API is unavailable.
        """
        return """# Personalized Insurance Policy

## Policy Overview
**Policy Type**: Comprehensive Coverage  
**Policy Holder**: Valued Customer  
**Coverage Amount**: As Requested  
**Duration**: 12 Months (Renewable)

## Coverage Details

### What's Covered
1. **Primary Coverage**: Full protection as per your selected plan
2. **Additional Benefits**: 
   - 24/7 Emergency Support
   - Worldwide Coverage
   - No Claim Bonus Protection

### Premium Structure
- **Monthly Premium**: Calculated based on risk assessment
- **Annual Payment Discount**: 5% off when paid yearly
- **Payment Methods**: Auto-debit, Credit Card, Bank Transfer

## Terms & Conditions
1. Policy is valid from the date of first premium payment
2. Coverage includes all standard benefits as per policy type
3. Claims must be filed within 30 days of incident
4. Policy automatically renews unless cancelled 30 days before expiry

## Exclusions
- Pre-existing conditions (waiting period applies)
- Intentional self-harm
- War or nuclear risks
- Illegal activities

## Important Note
*This is a sample policy generated in demo mode due to API limitations. For actual policy generation, please ensure your Gemini API has available quota.*

---
**Need Help?** Contact our support team for assistance.
"""

    def generate_policy(self, client_data: Dict, risk_result: Dict, pricing_result: Dict) -> str:
        """
        Generates a complete insurance policy using Gemini.
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
        
        try:
            return self._generate_with_retry(prompt)
        except Exception as e:
            print(f"AI Generation Error: {e}")
            # Return mock policy on complete failure
            return self._generate_mock_policy(prompt)

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
        
        try:
            return self._generate_with_retry(prompt)
        except Exception as e:
            print(f"AI Refinement Error: {e}")
            return "Unable to refine policy at this time due to API limitations. Please try again later or contact support."
