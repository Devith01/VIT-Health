from pydantic import BaseModel, Field
from typing import List, Optional

class OutbreakPredictionRequest(BaseModel):
    disease_category: str
    location_name: str
    historical_daily_cases: List[int] = Field(default=[2, 3, 5, 7, 9])
    threshold_count: int = 10

class OutbreakPredictionResponse(BaseModel):
    disease_category: str
    location_name: str
    current_cases: int
    threshold_count: int
    predicted_next_day_cases: int
    trend: str  # INCREASING, STABLE, DECREASING
    outbreak_risk: str  # LOW, MODERATE, HIGH, CRITICAL
    baseline_mae: float
    lstm_mae: float
    model_selected: str
    warning_triggered: bool
    message: str
    disclaimer: str = "Prototype threshold values require clinical and institutional validation before real-world deployment."
