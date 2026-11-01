from fastapi import APIRouter
from app.schemas.health import HealthResponse

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="healthy",
        service="V-Health AI Health Intelligence Engine",
        version="1.0.0",
        models_loaded={
            "disease_predictor_nn": False,
            "severity_classifier_xgboost": False,
            "outbreak_predictor_lstm": False
        },
        disclaimer="Academic Prototype proposed for VTOP (VIT Bhopal)"
    )
