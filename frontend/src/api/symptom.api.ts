import { apiClient } from './axios';

export interface SymptomQuestion {
  id: string;
  questionText: string;
  category: string;
  inputType: 'YES_NO' | 'MCQ' | 'SCALE';
  options?: string[];
}

export interface TriagePayload {
  // Basic 13 inputs
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  symptom_duration: 'Today' | 'Yesterday' | '2–3 days' | 'More than 3 days';
  fever: boolean;
  headache: boolean;
  body_muscle_pain: boolean;
  breathing_difficulty: boolean;
  vomiting: boolean;
  diarrhea: boolean;
  fatigue: boolean;
  chest_pain: boolean;
  dizziness: boolean;
  abdominal_pain: boolean;

  // Additional 3 inputs
  main_complaint: string | null;
  mental_status: string | null;
  pain_score: number;
}

export interface SymptomReportPayload {
  freeTextSymptoms?: string;
  painScale: number;
  durationDays: number;
  structuredInputs?: Record<string, boolean | string | number>;
  imageUrl?: string;
  isExplicitImageFlagged?: boolean;
  triagePayload?: TriagePayload;
}

export interface SymptomReportResult {
  id: string;
  freeTextSymptoms?: string;
  painScale: number;
  durationDays: number;
  status?: string;
  moderationWarning?: string;
  requiresDirectConsultation?: boolean;
  aiPrediction?: any;
  createdAt: string;
}

export interface WebsiteTriageResult {
  outcome: 'Emergency' | 'Hospital Visit Required' | 'Teleconsultation' | 'Self Care';
  esi_level: number;
  confidence: number;
  assessment_type: 'basic' | 'detailed';
  disclaimer: string;
}

export const getSymptomQuestionsApi = async (): Promise<{
  status: string;
  data: { questions: SymptomQuestion[] };
}> => {
  const response = await apiClient.get('/symptoms/questions');
  return response.data;
};

export const submitSymptomReportApi = async (
  payload: SymptomReportPayload
): Promise<{ status: string; data: { report: SymptomReportResult } }> => {
  const response = await apiClient.post('/symptoms/reports', payload);
  return response.data;
};


// ============================================================
// FASTAPI WEBSITE TRIAGE / XGBOOST
// ============================================================

const AI_SERVICE_URL = 'http://127.0.0.1:8001';

const MAIN_COMPLAINT_MAP: Record<string, string> = {
  'Fever / Infection': 'infectious',
  'Breathing Problem': 'respiratory',
  'Chest / Heart Problem': 'cardiovascular',
  'Stomach / Digestion Problem': 'gastrointestinal',
  'Headache / Nerve Problem': 'neurological',
  'Muscle / Bone / Joint Problem': 'musculoskeletal',
  'Eye Problem': 'ophthalmic',
  'Ear / Nose / Throat Problem': 'ENT',
  'Urinary / Reproductive Problem': 'genitourinary',
  'Injury / Accident': 'trauma',
  'Skin Problem': 'dermatological',
  'Mental / Emotional Problem': 'psychiatric',
  'Hormone / Metabolism Problem': 'endocrine',
};

const MENTAL_STATUS_MAP: Record<string, string> = {
  Alert: 'alert',
  Confused: 'confused',
  Drowsy: 'drowsy',
  Agitated: 'agitated',
  Unresponsive: 'unresponsive',
};

const DURATION_MAP: Record<TriagePayload['symptom_duration'], number> = {
  Today: 0,
  Yesterday: 1,
  '2–3 days': 2,
  'More than 3 days': 3,
};

export const submitWebsiteTriageApi = async (
  payload: TriagePayload
): Promise<WebsiteTriageResult> => {
  const requestBody = {
    age: payload.age,
    sex: payload.sex.toLowerCase(),

    symptom_duration: DURATION_MAP[payload.symptom_duration],

    fever: payload.fever,
    headache: payload.headache,
    body_muscle_pain: payload.body_muscle_pain,
    breathing_difficulty: payload.breathing_difficulty,
    vomiting: payload.vomiting,
    diarrhea: payload.diarrhea,
    fatigue: payload.fatigue,
    chest_pain: payload.chest_pain,
    dizziness: payload.dizziness,
    abdominal_pain: payload.abdominal_pain,

    main_complaint: payload.main_complaint
      ? MAIN_COMPLAINT_MAP[payload.main_complaint] || payload.main_complaint
      : null,

    mental_status: payload.mental_status
      ? MENTAL_STATUS_MAP[payload.mental_status] || payload.mental_status
      : null,

    pain_score: payload.main_complaint && payload.mental_status
      ? payload.pain_score
      : null,
  };

  console.log('[Frontend] Sending triage request to FastAPI:', requestBody);

  const response = await fetch(`${AI_SERVICE_URL}/ai/triage`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      '[Frontend] FastAPI triage request failed:',
      response.status,
      errorText
    );

    throw new Error(
      `FastAPI triage request failed: ${response.status}`
    );
  }

  const result: WebsiteTriageResult = await response.json();

  console.log('[Frontend] FastAPI XGBoost result:', result);

  return result;
};