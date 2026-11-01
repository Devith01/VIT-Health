from typing import List

class ExplainableAI:
    @staticmethod
    def generate_explanation(symptoms: List[str], duration_days: int, pain_scale: int) -> List[str]:
        factors = []
        if "fever" in symptoms:
            factors.append("Presence of systemic fever")
        if duration_days >= 3:
            factors.append(f"Persistent duration ({duration_days} days)")
        if pain_scale >= 7:
            factors.append(f"High reported pain intensity ({pain_scale}/10)")
        if "vomiting_nausea" in symptoms or "abdominal_pain" in symptoms:
            factors.append("Gastrointestinal distress involvement")
        if "headache" in symptoms:
            factors.append("Acute neurological cephalalgia (headache)")

        if not factors:
            factors.append("Routine symptom cluster evaluation")

        return factors
