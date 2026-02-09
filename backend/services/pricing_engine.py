from typing import Dict
from pydantic import BaseModel

class PricingResult(BaseModel):
    monthly_premium: float
    yearly_premium: float
    breakdown: Dict[str, float]
    explanation: str

class PricingEngine:
    def __init__(self):
        # Base rates per $1000 of coverage
        self.base_rates = {
            "life": 0.1,
            "health": 0.5,
            "auto": 0.3,
            "property": 0.2
        }

    def calculate_pricing(self, risk_score: str, coverage_amount: float, insurance_type: str) -> PricingResult:
        """
        Calculates premium based on risk score, coverage amount, and insurance type.
        """
        base_rate = self.base_rates.get(insurance_type.lower(), 0.3)
        
        # Risk Multiplier
        risk_multipliers = {
            "Low": 0.8,
            "Medium": 1.0,
            "High": 1.5
        }
        multiplier = risk_multipliers.get(risk_score, 1.0)
        
        # Calculate Base Premium
        monthly_base = (coverage_amount / 1000) * base_rate * multiplier
        
        # Fees and Riders (Mocked)
        processing_fee = 10.0
        rider_cost = 25.0 # Mocked rider cost
        
        monthly_total = monthly_base + processing_fee + rider_cost
        yearly_total = monthly_total * 12 * 0.95 # 5% discount for yearly
        
        breakdown = {
            "base_premium": monthly_base,
            "processing_fee": processing_fee,
            "rider_costs": rider_cost,
            "risk_adjustment": (multiplier - 1.0) * monthly_base
        }
        
        explanation = (
            f"Calculated pricing for {insurance_type} insurance with a {risk_score} risk profile. "
            f"Base rate adjusted by {multiplier}x for risk. Monthly premium: ${monthly_total:.2f}."
        )

        return PricingResult(
            monthly_premium=round(monthly_total, 2),
            yearly_premium=round(yearly_total, 2),
            breakdown=breakdown,
            explanation=explanation
        )
