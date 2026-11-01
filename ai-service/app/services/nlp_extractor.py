import re
from typing import List, Dict, Tuple

MEDICAL_KEYWORD_MAP = {
    "fever": ["fever", "temperature", "febrile", "hot body", "chills"],
    "headache": ["headache", "head pain", "migraine", "head throbbing"],
    "body_pain": ["body pain", "body ache", "muscle pain", "myalgia", "weakness", "fatigue"],
    "breathing_difficulty": ["breathing difficulty", "shortness of breath", "chest pain", "gasping", "breathless"],
    "vomiting_nausea": ["vomiting", "nausea", "puke", "throwing up", "stomach cramps", "diarrhea", "food poisoning"],
    "abdominal_pain": ["stomach ache", "abdominal pain", "belly pain", "gut pain"],
}

SEVERITY_KEYWORDS = {
    "HIGH": ["severe", "extreme", "unbearable", "intense", "high", "acute"],
    "MEDIUM": ["moderate", "persistent", "constant"],
    "LOW": ["mild", "slight", "minor", "little"],
}

class NLPSymptomExtractor:
    @staticmethod
    def extract_symptoms(text: str) -> Tuple[List[str], str]:
        if not text:
            return [], "LOW"

        lowered_text = text.lower()
        extracted = []

        for category, keywords in MEDICAL_KEYWORD_MAP.items():
            for kw in keywords:
                if kw in lowered_text:
                    extracted.append(category)
                    break

        detected_severity = "MEDIUM"
        for sev, keywords in SEVERITY_KEYWORDS.items():
            for kw in keywords:
                if kw in lowered_text:
                    detected_severity = sev
                    break

        return extracted, detected_severity
