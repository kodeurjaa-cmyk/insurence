from pydantic import BaseModel
from typing import List, Dict, Optional

class RiskFactor(BaseModel):
    name: str
    impact: str
    description: str

class RiskAssessmentResult(BaseModel):
    score: str  # Low, Medium, High
    score_value: float  # 0 to 1
    factors: List[RiskFactor]
    explanation: str

class RiskEngine:
    def __init__(self):
        pass

    def calculate_risk(self, client_data: Dict) -> RiskAssessmentResult:
        """
        Calculates risk based on age, lifestyle, medical history, and driving history.
        """
        score_value = 0.5
        factors = []
        
        # Age-based risk
        age = client_data.get('age', 30)
        if age > 60:
            score_value += 0.2
            factors.append(RiskFactor(name="Age", impact="High", description="Client is over 60, increasing health risk."))
        elif age < 25:
            score_value += 0.1
            factors.append(RiskFactor(name="Age", impact="Medium", description="Young client, potentially higher risk for certain insurance types."))

        # Income-based stability
        income = client_data.get('income', 50000)
        if income < 20000:
            score_value += 0.1
            factors.append(RiskFactor(name="Income", impact="Medium", description="Lower income may affect payment consistency."))

        # Medical History
        has_medical_issues = client_data.get('medical_history', False)
        if has_medical_issues:
            score_value += 0.3
            factors.append(RiskFactor(name="Medical History", impact="High", description="Pre-existing conditions increase premium."))

        # Lifestyle factors
        lifestyle = client_data.get('lifestyle', 'standard')
        if lifestyle == 'high_risk':
            score_value += 0.2
            factors.append(RiskFactor(name="Lifestyle", impact="High", description="Engages in high-risk activities."))

        # Normalize score
        score_value = min(1.0, max(0.0, score_value))
        
        if score_value < 0.4:
            score = "Low"
        elif score_value < 0.7:
            score = "Medium"
        else:
            score = "High"

        explanation = f"Risk assessment concluded with a {score} risk level due to factors: " + ", ".join([f.name for f in factors])

        return RiskAssessmentResult(
            score=score,
            score_value=score_value,
            factors=factors,
            explanation=explanation
        )
