from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any


# ============================================================
# EXISTING AI ASSESSMENT SCHEMAS
# ============================================================

class SymptomAssessmentRequest(BaseModel):
    free_text_symptoms: Optional[str] = ""
    pain_scale: int = Field(default=5, ge=1, le=10)
    duration_days: int = Field(default=1, ge=1)
    structured_inputs: Optional[Dict[str, Any]] = {}
    medical_history: Optional[List[str]] = []


class PredictedCondition(BaseModel):
    disease: str
    confidence: float
    description: str


class SymptomAssessmentResponse(BaseModel):
    extracted_symptoms: List[str]
    top_conditions: List[PredictedCondition]
    predicted_severity: str  # LOW, MEDIUM, HIGH, CRITICAL
    severity_score: float
    contributing_factors: List[str]
    recommended_action: str
    safety_override_triggered: bool
    safety_override_reason: Optional[str] = None
    disclaimer: str = (
        "This is an AI-assisted preliminary assessment and does not "
        "replace professional medical diagnosis."
    )


# ============================================================
# WEBSITE TRIAGE REQUEST
# ============================================================

class WebsiteTriageRequest(BaseModel):

    # -------------------------
    # Basic Patient Information
    # -------------------------

    age: int = Field(..., ge=0, le=120)

    sex: str

    symptom_duration: int = Field(
        ...,
        ge=0,
        le=3
    )

    # -------------------------
    # Basic Symptoms
    # -------------------------

    fever: bool = False
    headache: bool = False
    body_muscle_pain: bool = False
    breathing_difficulty: bool = False
    vomiting: bool = False
    diarrhea: bool = False
    fatigue: bool = False
    chest_pain: bool = False
    dizziness: bool = False
    abdominal_pain: bool = False

    # -------------------------
    # Optional Detailed Inputs
    # -------------------------

    main_complaint: Optional[str] = None

    mental_status: Optional[str] = None

    pain_score: Optional[int] = Field(
        default=None,
        ge=0,
        le=10
    )


# ============================================================
# WEBSITE TRIAGE RESPONSE
# ============================================================

class WebsiteTriageResponse(BaseModel):

    outcome: str

    esi_level: int = Field(
        ...,
        ge=1,
        le=5
    )

    confidence: float = Field(
        ...,
        ge=0.0,
        le=1.0
    )

    assessment_type: str

    disclaimer: str = (
        "This is an AI-assisted triage assessment and does not "
        "replace professional medical diagnosis."
    )


class MentalHealthAssessmentRequest(BaseModel):
    age: int = Field(..., ge=17, le=29)
    study_hours: int = Field(..., ge=0, le=12)
    exam_pressure: int = Field(..., ge=0, le=10)
    academic_performance: int = Field(..., ge=0, le=100)
    stress_level: int = Field(..., ge=0, le=10)
    anxiety_frequency: int = Field(..., ge=0, le=8)
    depressive_feelings: int = Field(..., ge=0, le=6)
    sleep_hours: int = Field(..., ge=3, le=10)
    physical_activity: int = Field(..., ge=0, le=8)
    social_support: int = Field(..., ge=0, le=10)
    screen_hours: int = Field(..., ge=1, le=12)
    internet_hours: int = Field(..., ge=1, le=13)
    financial_stress: int = Field(..., ge=0, le=10)
    family_pressure: int = Field(..., ge=0, le=10)
    academic_exhaustion: int = Field(..., ge=0, le=10)


class MentalHealthAssessmentResponse(BaseModel):
    prediction: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    risk_category: str
    disclaimer: str = (
        "This is an AI-assisted wellbeing screening and does not "
        "replace professional medical diagnosis."
    )
