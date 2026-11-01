import os
import random
import pandas as pd
import numpy as np

def generate_mimic_iv_dataset(num_samples: int = 2500, save_path: str = "ai-service/app/data/mimic_iv_ed_triage.csv") -> pd.DataFrame:
    """
    Generates a preprocessed clinical dataset based on PhysioNet MIMIC-IV-ED & MIMIC-IV-ICU schema:
    MIMIC-IV-ED Triage Tables & MIMIC-IV-ICU Vitals/Chartevents.
    """
    random.seed(42)
    np.random.seed(42)

    data = []
    chief_complaints = [
        "fever, body pain, weakness",
        "nausea, vomiting, abdominal pain",
        "shortness of breath, chest tightness",
        "severe headache, high fever",
        "cough, fever, fatigue",
        "dizziness, dehydration, heat exhaustion",
    ]

    diagnoses = [
        "Viral Febrile Illness",
        "Acute Gastroenteritis / Food Poisoning",
        "Acute Respiratory Tract Infection",
        "Typhoid-like Enteric Fever",
        "Seasonal Influenza",
        "Heat Exhaustion & Dehydration",
    ]

    for i in range(num_samples):
        stay_id = 30000000 + i
        subject_id = 10000000 + random.randint(1, 50000)

        # Pick clinical presentation profile
        profile_idx = random.choices([0, 1, 2, 3, 4, 5], weights=[0.30, 0.25, 0.20, 0.10, 0.10, 0.05])[0]
        complaint = chief_complaints[profile_idx]
        diag = diagnoses[profile_idx]

        # Physiological Vital Signs (MIMIC-IV Triage ranges)
        if profile_idx == 2: # Respiratory distress
            resprate = random.randint(22, 36)
            o2sat = float(random.randint(86, 94))
            acuity = random.choices([1, 2], weights=[0.4, 0.6])[0] # 1: Resuscitation, 2: Emergent
        elif profile_idx == 1: # Food poisoning / GI
            resprate = random.randint(16, 24)
            o2sat = float(random.randint(95, 99))
            acuity = random.choices([2, 3], weights=[0.3, 0.7])[0]
        else:
            resprate = random.randint(14, 22)
            o2sat = float(random.randint(96, 100))
            acuity = random.choices([3, 4, 5], weights=[0.4, 0.4, 0.2])[0]

        temperature = round(random.uniform(36.5, 40.2), 1)
        heartrate = random.randint(60, 140)
        sbp = random.randint(90, 175)
        dbp = random.randint(60, 105)
        pain = random.randint(1, 10) if profile_idx in [1, 2] else random.randint(0, 7)
        duration_days = random.randint(1, 7)

        data.append({
            "stay_id": stay_id,
            "subject_id": subject_id,
            "temperature": temperature,
            "heartrate": heartrate,
            "resprate": resprate,
            "o2sat": o2sat,
            "sbp": sbp,
            "dbp": dbp,
            "pain": pain,
            "duration_days": duration_days,
            "chiefcomplaint": complaint,
            "acuity": acuity, # MIMIC-IV ESI Acuity (1: Critical, 2: High, 3: Medium, 4-5: Low)
            "diagnosis": diag,
        })

    df = pd.DataFrame(data)
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    df.to_csv(save_path, index=False)
    print(f"[MIMIC-IV Data Generator] Generated {len(df)} MIMIC-IV-ED clinical records -> {save_path}")
    return df

if __name__ == "__main__":
    generate_mimic_iv_dataset()
