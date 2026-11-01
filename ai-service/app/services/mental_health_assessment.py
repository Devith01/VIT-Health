import os

import joblib
import pandas as pd


MODEL_PATH = os.path.join(
    "app", "models", "mental_health_student_xgb.pkl"
)


class MentalHealthAssessmentService:
    def __init__(self):
        bundle = joblib.load(MODEL_PATH)
        self.model = bundle["model"]
        self.label_encoder = bundle["label_encoder"]
        self.feature_order = bundle["features"]

        if len(self.feature_order) != 15:
            raise RuntimeError("Mental-health model must define 15 features.")

        print(
            "[MentalHealthXGBoost] Model loaded with features:",
            self.feature_order
        )

    def predict(self, request):
        feature_values = {
            "age": request.age,
            "study_hours_per_day": request.study_hours,
            "exam_pressure": request.exam_pressure,
            "academic_performance": request.academic_performance,
            "stress_level": request.stress_level,
            "anxiety_score": request.anxiety_frequency,
            "depression_score": request.depressive_feelings,
            "sleep_hours": request.sleep_hours,
            "physical_activity": request.physical_activity,
            "social_support": request.social_support,
            "screen_time": request.screen_hours,
            "internet_usage": request.internet_hours,
            "financial_stress": request.financial_stress,
            "family_expectation": request.family_pressure,
            "burnout_score": request.academic_exhaustion,
        }

        features = pd.DataFrame(
            [[feature_values[name] for name in self.feature_order]],
            columns=self.feature_order,
        )
        predicted_code = int(self.model.predict(features)[0])
        probabilities = self.model.predict_proba(features)[0]
        prediction = str(
            self.label_encoder.inverse_transform([predicted_code])[0]
        )

        print("[MentalHealthXGBoost] Input features:", features.values.tolist())
        print("[MentalHealthXGBoost] Predicted class:", prediction)
        print("[MentalHealthXGBoost] Confidence:", float(probabilities[predicted_code]))

        return {
            "prediction": prediction,
            "confidence": float(probabilities[predicted_code]),
            "risk_category": f"{prediction.upper()}_CONCERN",
        }


mental_health_assessment_service = MentalHealthAssessmentService()
