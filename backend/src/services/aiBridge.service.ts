import axios from 'axios';
import { env } from '../config/env.js';

export interface TriagePayload {
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

  main_complaint: string | null;
  mental_status: string | null;
  pain_score: number;
}

export interface AIAssessmentPayload {
  free_text_symptoms?: string;
  pain_scale: number;
  duration_days: number;
  structured_inputs?: Record<string, any>;
  triagePayload?: TriagePayload;
}

const severityForTriageOutcome = (
  outcome: string
): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' => {
  switch (outcome.trim().toLowerCase()) {
    case 'emergency':
      return 'CRITICAL';
    case 'hospital visit required':
      return 'HIGH';
    case 'teleconsultation':
      return 'MEDIUM';
    case 'self care':
      return 'LOW';
    default:
      return 'MEDIUM';
  }
};

export class AIBridgeService {

  static async assessSymptoms(payload: AIAssessmentPayload) {
    if (!payload.triagePayload) {
      throw new Error('An XGBoost triage payload is required for symptom assessment.');
    }

    try {
      const triage = payload.triagePayload;

        // Convert frontend duration text to FastAPI integer.
        const durationMap: Record<string, number> = {
          'Today': 0,
          'Yesterday': 1,
          '2–3 days': 2,
          'More than 3 days': 3,
        };

        // Convert frontend complaint labels to model categories.
        const complaintMap: Record<string, string> = {
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

        // Convert mental-status labels to backend/model values.
        const mentalStatusMap: Record<string, string> = {
          'Alert': 'alert',
          'Confused': 'confused',
          'Drowsy': 'drowsy',
          'Agitated': 'agitated',
          'Unresponsive': 'unresponsive',
        };

        const triageRequest = {
          age: triage.age,
          sex: triage.sex,

          symptom_duration:
            durationMap[triage.symptom_duration] ?? 0,

          fever: triage.fever,
          headache: triage.headache,
          body_muscle_pain: triage.body_muscle_pain,
          breathing_difficulty: triage.breathing_difficulty,
          vomiting: triage.vomiting,
          diarrhea: triage.diarrhea,
          fatigue: triage.fatigue,
          chest_pain: triage.chest_pain,
          dizziness: triage.dizziness,
          abdominal_pain: triage.abdominal_pain,

          /*
           * These are sent only when the detailed assessment
           * was requested.
           */
          main_complaint: triage.main_complaint
            ? complaintMap[triage.main_complaint] ?? 'infectious'
            : null,

          mental_status: triage.mental_status
            ? mentalStatusMap[triage.mental_status] ?? 'alert'
            : null,

          pain_score: triage.pain_score,
        };

        console.log(
          '[AIBridgeService] Sending website triage to FastAPI /ai/triage'
        );

        console.log(
          '[AIBridgeService] Triage request:',
          JSON.stringify(triageRequest)
        );

        const response = await axios.post(
          `${env.AI_SERVICE_URL}/ai/triage`,
          triageRequest,
          {
            timeout: 5000,
          }
        );

        const result = response.data;

        const validOutcomes = new Set([
          'Emergency',
          'Hospital Visit Required',
          'Teleconsultation',
          'Self Care',
        ]);

        if (!validOutcomes.has(result.outcome)) {
          throw new Error('XGBoost triage returned an invalid outcome.');
        }

        console.log(
          '[AIBridgeService] Website XGBoost result:',
          JSON.stringify(result)
        );

        /*
         * Convert the XGBoost triage result into the structure
         * expected by the existing SymptomService/database.
         */

      return {
          top_conditions: [],
          predicted_severity: severityForTriageOutcome(result.outcome),
          severity_score: result.confidence,
          extracted_symptoms: [],
          contributing_factors: [
            `Website XGBoost assessment: ${result.assessment_type}`,
            `ESI level: ${result.esi_level}`,
          ],
          recommended_action: result.outcome,
          safety_override_triggered: false,
          safety_override_reason: null,

          // Keep the original triage information available.
          triage_outcome: result.outcome,
          triage_esi_level: result.esi_level,
          triage_confidence: result.confidence,
          triage_assessment_type: result.assessment_type,

          disclaimer: result.disclaimer,
      };

    } catch (err: any) {
      console.error(
        '[AIBridgeService] XGBoost triage request failed:',
        err?.message || err
      );

      throw new Error(
        'The XGBoost triage service is unavailable. Start the AI service and try again.'
      );
    }
  }
}
