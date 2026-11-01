from fastapi import APIRouter
from app.schemas.outbreak import OutbreakPredictionRequest, OutbreakPredictionResponse
from app.services.time_series_forecaster import TimeSeriesOutbreakForecaster

router = APIRouter(prefix="/ai", tags=["Outbreak Forecasting"])

@router.post("/predict-outbreak", response_model=OutbreakPredictionResponse)
def predict_outbreak(request: OutbreakPredictionRequest):
    predicted_next, trend, outbreak_risk, b_mae, l_mae, model_used = TimeSeriesOutbreakForecaster.forecast_outbreak(
        request.historical_daily_cases, request.threshold_count
    )

    current_cases = request.historical_daily_cases[-1] if request.historical_daily_cases else 9
    warning_triggered = predicted_next >= (request.threshold_count * 0.8)

    message = (
        f"EARLY OUTBREAK WARNING: {request.disease_category} in {request.location_name}. "
        f"Current cases: {current_cases}, Threshold: {request.threshold_count}. "
        f"{model_used} predicts {predicted_next} cases tomorrow (Trend: {trend})."
    )

    return OutbreakPredictionResponse(
        disease_category=request.disease_category,
        location_name=request.location_name,
        current_cases=current_cases,
        threshold_count=request.threshold_count,
        predicted_next_day_cases=predicted_next,
        trend=trend,
        outbreak_risk=outbreak_risk,
        baseline_mae=b_mae,
        lstm_mae=l_mae,
        model_selected=model_used,
        warning_triggered=warning_triggered,
        message=message,
    )
