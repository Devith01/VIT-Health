from fastapi import APIRouter

from app.schemas.ai import (
    SymptomAssessmentRequest,
    SymptomAssessmentResponse,
    WebsiteTriageRequest,
    WebsiteTriageResponse,
    MentalHealthAssessmentRequest,
    MentalHealthAssessmentResponse,
)

from app.services.nlp_extractor import NLPSymptomExtractor
from app.services.disease_predictor import DiseasePredictor
from app.services.severity_classifier import XGBoostSeverityClassifier
from app.services.explainability import ExplainableAI
from app.services.website_triage import website_triage_service
from app.services.mental_health_assessment import mental_health_assessment_service


router = APIRouter(
    prefix="/ai",
    tags=["AI Intelligence"]
)


# ============================================================
# EXISTING AI ASSESSMENT
# ============================================================

@router.post(
    "/assess",
    response_model=SymptomAssessmentResponse
)
def assess_symptoms(
    request: SymptomAssessmentRequest
):

    # 1. NLP Feature Extraction
    extracted, text_severity = (
        NLPSymptomExtractor.extract_symptoms(
            request.free_text_symptoms
        )
    )

    # Merge structured inputs if present
    if request.structured_inputs:

        for k, v in request.structured_inputs.items():

            if (
                v
                and isinstance(k, str)
                and k not in extracted
            ):
                extracted.append(k)

    # 2. Disease Prediction
    top_conditions = (
        DiseasePredictor.predict_conditions(
            extracted,
            request.pain_scale,
            request.duration_days
        )
    )

    # 3. Existing Severity Classification
    severity, score, override_triggered, override_reason = (
        XGBoostSeverityClassifier.classify_severity(
            extracted,
            request.pain_scale,
            request.duration_days,
            text_severity
        )
    )

    # 4. Explainable AI
    factors = (
        ExplainableAI.generate_explanation(
            extracted,
            request.duration_days,
            request.pain_scale
        )
    )

    # Recommended Action Mapping
    recommended_action = (
        "Routine clinic consultation or self-care monitoring."
    )

    if severity == "CRITICAL":

        recommended_action = (
            "IMMEDIATE EMERGENCY WORKFLOW: "
            "Clinic notified & nearest ambulance assigned."
        )

    elif severity == "HIGH":

        recommended_action = (
            "Priority doctor appointment allocation recommended."
        )

    elif severity == "MEDIUM":

        recommended_action = (
            "Teleconsultation or early medical review recommended."
        )

    return SymptomAssessmentResponse(

        extracted_symptoms=extracted,

        top_conditions=top_conditions,

        predicted_severity=severity,

        severity_score=score,

        contributing_factors=factors,

        recommended_action=recommended_action,

        safety_override_triggered=override_triggered,

        safety_override_reason=override_reason,
    )


# ============================================================
# NEW WEBSITE TRIAGE ENDPOINT
# ============================================================

@router.post(
    "/triage",
    response_model=WebsiteTriageResponse
)
def website_triage(
    request: WebsiteTriageRequest
):

    result = website_triage_service.predict(
        request
    )

    return WebsiteTriageResponse(

        outcome=result["outcome"],

        esi_level=result["esi_level"],

        confidence=result["confidence"],

        assessment_type=result["assessment_type"],
    )


@router.post(
    "/mental-health/assess",
    response_model=MentalHealthAssessmentResponse,
)
def assess_mental_health(request: MentalHealthAssessmentRequest):
    return mental_health_assessment_service.predict(request)
