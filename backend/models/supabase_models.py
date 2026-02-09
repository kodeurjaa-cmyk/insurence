from supabase import create_client, Client
from backend.config import Config
from typing import Dict, List, Optional
import uuid

class SupabaseModels:
    def __init__(self):
        self.url: str = Config.SUPABASE_URL or ""
        self.key: str = Config.SUPABASE_KEY or ""
        if self.url and self.key:
            self.supabase: Client = create_client(self.url, self.key)
        else:
            self.supabase = None
            print("Warning: Supabase credentials not found. DB operations will be bypassed.")

    def create_user(self, user_data: Dict) -> Dict:
        if not self.supabase: return user_data
        response = self.supabase.table('users').insert(user_data).execute()
        return response.data[0]

    def save_risk_assessment(self, policy_id: str, risk_data: Dict) -> Dict:
        if not self.supabase: return risk_data
        data = {**risk_data, "policy_id": policy_id}
        response = self.supabase.table('risk_assessments').insert(data).execute()
        return response.data[0]

    def save_pricing(self, policy_id: str, pricing_data: Dict) -> Dict:
        if not self.supabase: return pricing_data
        data = {**pricing_data, "policy_id": policy_id}
        response = self.supabase.table('pricing_details').insert(data).execute()
        return response.data[0]

    def create_policy(self, user_id: str, initial_data: Dict) -> Dict:
        if not self.supabase: return {"id": str(uuid.uuid4()), **initial_data}
        data = {**initial_data, "user_id": user_id}
        response = self.supabase.table('policies').insert(data).execute()
        return response.data[0]

    def save_policy_version(self, policy_id: str, policy_text: str, version_note: str = "Initial version") -> Dict:
        if not self.supabase: return {"policy_id": policy_id, "text": policy_text, "note": version_note}
        data = {
            "policy_id": policy_id,
            "policy_text": policy_text,
            "version_note": version_note
        }
        response = self.supabase.table('policy_versions').insert(data).execute()
        return response.data[0]

    def log_prompt(self, policy_id: str, prompt_text: str) -> Dict:
        if not self.supabase: return {"policy_id": policy_id, "prompt": prompt_text}
        data = {
            "policy_id": policy_id,
            "prompt_text": prompt_text
        }
        response = self.supabase.table('prompts_log').insert(data).execute()
        return response.data[0]
