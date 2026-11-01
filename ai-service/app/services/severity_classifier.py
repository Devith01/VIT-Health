import os
import joblib
import numpy as np
from typing import List, Tuple

MODEL_DIR = "app/models"
XGB_MODEL_PATH = os.path.join(MODEL_DIR, "mimic_xgboost.joblib")
SCALER_PATH = os.path.join(MODEL_DIR, "mimic_scaler.joblib")

class MIMICXGBoostSeverityService:
    """
    PhysioNet MIMIC-IV-ED Trained XGBoost Classifier for Acuity & Severity Classification
    """
    def __init__(self):
        self.model = None
        self.scaler = None

        if os.path.exists(XGB_MODEL_PATH) and os.path.exists(SCALER_PATH):
            try:
                self.model = joblib.load(XGB_MODEL_PATH)
                self.scaler = joblib.load(SCALER_PATH)
                print("[XGBoostSeverity] Loaded trained PhysioNet MIMIC-IV XGBoost model successfully.")
            except Exception as e:
                print("[XGBoostSeverity] Warning loading MIMIC XGBoost model:", e)

    def classify_severity(
        self,
        symptoms: List[str],
        pain_scale: int,
        duration_days: int,
        text_severity: str
    ) -> Tuple[str, float, bool, str]:
        symptom_set = set(symptoms)

        # Rule-Based Safety Override check for CRITICAL emergency conditions
        if "breathing_difficulty" in symptom_set:
            return (
                "CRITICAL",
                98.0,
                True,
                "SAFETY OVERRIDE: Severe breathing difficulty / chest tightness detected. Flagged for immediate emergency response workflow regardless of model probability.",
            )

        # Run MIMIC-IV Trained XGBoost Model Inference if available
        if self.model and self.scaler:
            try:
                temp = 38.5 if "fever" in symptom_set else 37.0
                hr = 105 if "fever" in symptom_set or "body_pain" in symptom_set else 80
                resp = 26 if "breathing_difficulty" in symptom_set else 18
                o2 = 92.0 if "breathing_difficulty" in symptom_set else 98.0
                sbp = 145 if text_severity == "HIGH" or pain_scale >= 7 else 120
                dbp = 90 if text_severity == "HIGH" or pain_scale >= 7 else 80

                feat = np.array([[temp, hr, resp, o2, sbp, dbp, float(pain_scale), float(duration_days)]])
                feat_scaled = self.scaler.transform(feat)
                acuity_pred = int(self.model.predict(feat_scaled)[0])

                # Map MIMIC-IV ESI Acuity (0: ESI-1 Resuscitation, 1: ESI-2 Emergent, 2: ESI-3 Urgent, 3-4: Low)
                if acuity_pred in [0, 1]:
                    sev_label = "HIGH"
                elif acuity_pred == 2:
                    sev_label = "MEDIUM"
                else:
                    sev_label = "LOW"

                calc_score = min(float((pain_scale * 5.0) + (duration_days * 4.0) + (len(symptoms) * 10.0)), 100.0)
                return (sev_label, calc_score, False, None)
            except Exception as err:
                print("[XGBoostSeverity] MIMIC-IV Inference fallback:", err)

        # Heuristic Base
        score = (pain_scale * 5.0) + (duration_days * 4.0) + (len(symptoms) * 10.0)
        if text_severity == "HIGH":
            score += 20.0
        score = min(score, 100.0)

        if score >= 75.0 or pain_scale >= 8 or duration_days >= 4:
            return ("HIGH", score, False, None)
        elif score >= 45.0 or pain_scale >= 5 or duration_days >= 2:
            return ("MEDIUM", score, False, None)
        else:
            return ("LOW", score, False, None)

_mimic_xgb_instance = MIMICXGBoostSeverityService()

class XGBoostSeverityClassifier:
    @staticmethod
    def classify_severity(
        symptoms: List[str],
        pain_scale: int,
        duration_days: int,
        text_severity: str
    ) -> Tuple[str, float, bool, str]:
        return _mimic_xgb_instance.classify_severity(symptoms, pain_scale, duration_days, text_severity)
