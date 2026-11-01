import os
import joblib
import numpy as np


MODEL_DIR = "app/models"

BASIC_MODEL_PATH = os.path.join(
    MODEL_DIR, "triage_basic_13_model.pkl"
)

BASIC_FEATURES_PATH = os.path.join(
    MODEL_DIR, "triage_basic_13_model_features.pkl"
)

DETAILED_MODEL_PATH = os.path.join(
    MODEL_DIR, "triage_detailed_16_model.pkl"
)

DETAILED_FEATURES_PATH = os.path.join(
    MODEL_DIR, "triage_detailed_16_model_features.pkl"
)

ENCODERS_PATH = os.path.join(
    MODEL_DIR, "triage_website_encoders.pkl"
)


class WebsiteTriageService:

    def __init__(self):
        print("[WebsiteTriage] Loading models...")

        self.basic_model = joblib.load(BASIC_MODEL_PATH)
        self.basic_features = joblib.load(BASIC_FEATURES_PATH)

        self.detailed_model = joblib.load(DETAILED_MODEL_PATH)
        self.detailed_features = joblib.load(DETAILED_FEATURES_PATH)

        self.encoders = joblib.load(ENCODERS_PATH)

        print("[WebsiteTriage] Models loaded successfully.")
        print(
            "[WebsiteTriage] Basic model features:",
            self.basic_features
        )
        print(
            "[WebsiteTriage] Detailed model features:",
            self.detailed_features
        )

    @staticmethod
    def duration_to_value(duration):
        """
        Frontend duration values:

        0 = Today
        1 = Yesterday
        2 = 2-3 days
        3 = More than 3 days

        Training values:

        1 = today/sudden/hours
        2 = yesterday
        3 = days
        4 = chronic/longstanding/months/years
        0 = unknown
        """

        mapping = {
            0: 1,
            1: 2,
            2: 3,
            3: 4
        }

        return mapping.get(duration, 0)

    @staticmethod
    def main_complaint_to_value(value):

        mapping = {
            "infectious": 0,
            "respiratory": 1,
            "cardiovascular": 2,
            "gastrointestinal": 3,
            "neurological": 4,
            "musculoskeletal": 5,
            "ophthalmic": 6,
            "ENT": 7,
            "genitourinary": 8,
            "trauma": 9,
            "dermatological": 10,
            "psychiatric": 11,
            "endocrine": 12
        }

        return mapping.get(value, 0)

    @staticmethod
    def mental_status_to_value(value):

        mapping = {
            "alert": 0,
            "confused": 1,
            "drowsy": 2,
            "agitated": 3,
            "unresponsive": 4
        }

        return mapping.get(value, 0)

    def encode_sex(self, sex):

        encoder = self.encoders.get("sex_encoder")
        normalized_sex = {
            "male": "m",
            "female": "f",
            "other": "other",
        }.get(str(sex).strip().lower(), str(sex).strip().lower())

        if encoder is None:
            raise ValueError(
                "sex_encoder not found in triage_website_encoders.pkl"
            )

        try:
            return int(
                encoder.transform([normalized_sex])[0]
            )

        except Exception:

            classes = list(encoder.classes_)

            for i, value in enumerate(classes):
                if str(value).lower() == normalized_sex:
                    return i

            raise ValueError(
                f"Unknown sex value: {sex}. "
                f"Expected one of: {classes}"
            )

    def build_features(self, request, detailed=False):

        sex_encoded = self.encode_sex(request.sex)

        duration_value = self.duration_to_value(
            request.symptom_duration
        )

        data = {
            "age": request.age,
            "sex_encoded": sex_encoded,

            "fever": int(request.fever),
            "headache": int(request.headache),
            "body_muscle_pain": int(request.body_muscle_pain),
            "breathing_difficulty": int(
                request.breathing_difficulty
            ),
            "vomiting": int(request.vomiting),
            "diarrhea": int(request.diarrhea),
            "fatigue": int(request.fatigue),
            "chest_pain": int(request.chest_pain),
            "dizziness": int(request.dizziness),
            "abdominal_pain": int(
                request.abdominal_pain
            ),

            "symptom_duration": duration_value
        }

        if detailed:

            data["main_complaint_encoded"] = (
                self.main_complaint_to_value(
                    request.main_complaint
                )
            )

            data["mental_status_encoded"] = (
                self.mental_status_to_value(
                    request.mental_status
                )
            )

            data["pain_score"] = request.pain_score

        return data

    @staticmethod
    def esi_to_outcome(esi):

        if esi in [1, 2]:
            return "Emergency"

        if esi == 3:
            return "Hospital Visit Required"

        if esi == 4:
            return "Teleconsultation"

        return "Self Care"

    def predict(self, request):

        # Determine whether all optional detailed fields
        # have been supplied.
        detailed = (
            request.main_complaint is not None
            and request.mental_status is not None
            and request.pain_score is not None
        )

        feature_data = self.build_features(
            request,
            detailed=detailed
        )

        # -------------------------------------------------
        # SELECT THE CORRECT TRAINED XGBOOST MODEL
        # -------------------------------------------------

        if detailed:

            model = self.detailed_model
            features = self.detailed_features
            assessment_type = "detailed"

            print(
                "[WebsiteTriage] Using DETAILED "
                "16-feature XGBoost model"
            )

        else:

            model = self.basic_model
            features = self.basic_features
            assessment_type = "basic"

            print(
                "[WebsiteTriage] Using BASIC "
                "13-feature XGBoost model"
            )

        # -------------------------------------------------
        # BUILD INPUT USING EXACT TRAINING FEATURE ORDER
        # -------------------------------------------------

        X = np.array(
            [
                feature_data[feature]
                for feature in features
            ],
            dtype=float
        ).reshape(1, -1)

        print(
            "[WebsiteTriage] Input features:",
            X.tolist()
        )

        # -------------------------------------------------
        # XGBOOST PREDICTION
        # -------------------------------------------------

        probabilities = model.predict_proba(X)[0]

        predicted_class = int(
            np.argmax(probabilities)
        )

        esi = predicted_class + 1

        confidence = float(
            probabilities[predicted_class]
        )

        outcome = self.esi_to_outcome(esi)

        # -------------------------------------------------
        # PRINT MODEL RESULT TO TERMINAL
        # -------------------------------------------------

        print(
            "[WebsiteTriage] XGBoost predicted class:",
            predicted_class
        )

        print(
            "[WebsiteTriage] ESI level:",
            esi
        )

        print(
            "[WebsiteTriage] Confidence:",
            round(confidence, 4)
        )

        print(
            "[WebsiteTriage] Final outcome:",
            outcome
        )

        print(
            "[WebsiteTriage] ------------------------------"
        )

        return {
            "outcome": outcome,
            "esi_level": esi,
            "confidence": round(confidence, 4),
            "assessment_type": assessment_type
        }


website_triage_service = WebsiteTriageService()
