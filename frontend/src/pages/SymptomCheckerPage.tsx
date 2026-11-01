import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitSymptomReportApi, TriagePayload } from '../api/symptom.api';

import {
  Stethoscope,
  CheckCircle2,
  Activity,
  ArrowRight,
  RotateCcw,
  Check,
  ShieldAlert,
  HelpCircle,
  Sparkles,
  Info,
} from 'lucide-react';

export type TriageOutcome =
  | 'Emergency'
  | 'Hospital Visit Required'
  | 'Teleconsultation'
  | 'Self Care';

export interface SymptomItem {
  key: keyof Pick<
    TriagePayload,
    | 'fever'
    | 'headache'
    | 'body_muscle_pain'
    | 'breathing_difficulty'
    | 'vomiting'
    | 'diarrhea'
    | 'fatigue'
    | 'chest_pain'
    | 'dizziness'
    | 'abdominal_pain'
  >;
  label: string;
  icon: string;
  category: string;
}

const SYMPTOM_LIST: SymptomItem[] = [
  {
    key: 'fever',
    label: 'Fever',
    icon: '🌡️',
    category: 'Infection',
  },
  {
    key: 'headache',
    label: 'Headache',
    icon: '🤕',
    category: 'Neurological',
  },
  {
    key: 'body_muscle_pain',
    label: 'Body / Muscle Pain',
    icon: '💪',
    category: 'Musculoskeletal',
  },
  {
    key: 'breathing_difficulty',
    label: 'Breathing Difficulty',
    icon: '🫁',
    category: 'Respiratory',
  },
  {
    key: 'vomiting',
    label: 'Vomiting',
    icon: '🤢',
    category: 'Gastrointestinal',
  },
  {
    key: 'diarrhea',
    label: 'Diarrhea',
    icon: '🚽',
    category: 'Gastrointestinal',
  },
  {
    key: 'fatigue',
    label: 'Fatigue',
    icon: '😴',
    category: 'General',
  },
  {
    key: 'chest_pain',
    label: 'Chest Pain',
    icon: '🫀',
    category: 'Cardiovascular',
  },
  {
    key: 'dizziness',
    label: 'Dizziness',
    icon: '💫',
    category: 'Neurological',
  },
  {
    key: 'abdominal_pain',
    label: 'Abdominal Pain',
    icon: '⚡',
    category: 'Gastrointestinal',
  },
];

const MAIN_COMPLAINT_OPTIONS = [
  'Fever / Infection',
  'Breathing Problem',
  'Chest / Heart Problem',
  'Stomach / Digestion Problem',
  'Headache / Nerve Problem',
  'Muscle / Bone / Joint Problem',
  'Eye Problem',
  'Ear / Nose / Throat Problem',
  'Urinary / Reproductive Problem',
  'Injury / Accident',
  'Skin Problem',
  'Mental / Emotional Problem',
  'Hormone / Metabolism Problem',
];

const MENTAL_STATUS_OPTIONS = [
  {
    value: 'Alert',
    label: 'Alert — Fully awake and responding normally',
  },
  {
    value: 'Confused',
    label: 'Confused — Having difficulty thinking or understanding',
  },
  {
    value: 'Drowsy',
    label: 'Drowsy — Very sleepy or difficult to keep awake',
  },
  {
    value: 'Agitated',
    label: 'Agitated — Extremely restless or unusually excited',
  },
  {
    value: 'Unresponsive',
    label: 'Unresponsive — Not responding normally',
  },
];

const DEFAULT_PAYLOAD: TriagePayload = {
  age: 20,
  sex: 'Male',
  symptom_duration: 'Today',
  fever: false,
  headache: false,
  body_muscle_pain: false,
  breathing_difficulty: false,
  vomiting: false,
  diarrhea: false,
  fatigue: false,
  chest_pain: false,
  dizziness: false,
  abdominal_pain: false,
  main_complaint: null,
  mental_status: null,
  pain_score: 0,
};

export const SymptomCheckerPage: React.FC = () => {
  const navigate = useNavigate();

  // 1 = Patient Info
  // 2 = Symptoms
  // 3 = Additional Details
  // 4 = Triage Result
  const [currentStep, setCurrentStep] = useState<number>(1);

  const [wantAdditionalDetails, setWantAdditionalDetails] =
    useState<boolean | null>(null);

  const [payload, setPayload] =
    useState<TriagePayload>(DEFAULT_PAYLOAD);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [outcome, setOutcome] =
    useState<TriageOutcome | null>(null);

  const [showPayloadInspector, setShowPayloadInspector] =
    useState<boolean>(false);

  const updatePayload = <K extends keyof TriagePayload>(
    key: K,
    val: TriagePayload[K]
  ) => {
    setPayload((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const toggleSymptom = (key: SymptomItem['key']) => {
    setPayload((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /**
   * Converts backend prediction into the four patient-facing outcomes.
   *
   * The backend should return:
   * Emergency
   * Hospital Visit Required
   * Teleconsultation
   * Self Care
   *
   * The ESI level is NOT shown to the patient.
   */
  const normalizeOutcome = (
    value: unknown
  ): TriageOutcome | null => {
    if (typeof value !== 'string') {
      return null;
    }

    const normalized = value.trim().toLowerCase();

    if (normalized === 'emergency') {
      return 'Emergency';
    }

    if (
      normalized === 'hospital visit required' ||
      normalized === 'hospital_visit_required'
    ) {
      return 'Hospital Visit Required';
    }

    if (
      normalized === 'teleconsultation' ||
      normalized === 'teleconsult'
    ) {
      return 'Teleconsultation';
    }

    if (
      normalized === 'self care' ||
      normalized === 'self_care'
    ) {
      return 'Self Care';
    }

    if (normalized === 'critical') {
      return 'Emergency';
    }

    if (normalized === 'high') {
      return 'Hospital Visit Required';
    }

    if (normalized === 'medium') {
      return 'Teleconsultation';
    }

    if (normalized === 'low') {
      return 'Self Care';
    }

    return null;
  };

  /**
   * Sends the complete 16-feature assessment to the Node backend.
   *
   * Architecture:
   *
   * React
   *   ↓
   * POST /symptoms/reports
   *   ↓
   * Node SymptomService
   *   ↓
   * AIBridgeService
   *   ↓
   * FastAPI /ai/triage
   *   ↓
   * Website XGBoost model
   *   ↓
   * Node response
   *   ↓
   * React result
   */
  const handleGenerateAssessment = async (
    includeAdditional: boolean
  ) => {
    setIsLoading(true);

    const finalPayload: TriagePayload = {
      ...payload,

      // If user chooses the basic assessment,
      // detailed fields are still sent as safe defaults.
      main_complaint: includeAdditional
        ? payload.main_complaint ||
          MAIN_COMPLAINT_OPTIONS[0]
        : null,

      mental_status: includeAdditional
        ? payload.mental_status || 'Alert'
        : null,

      pain_score: includeAdditional
        ? payload.pain_score
        : 0,
    };

    setPayload(finalPayload);

    try {
      console.log(
        '[SymptomChecker] Sending 16-feature triage payload to Node backend...'
      );

      console.log(
        '[SymptomChecker] Triage payload:',
        finalPayload
      );

      const response = await submitSymptomReportApi({
        freeTextSymptoms: [
          `Age: ${finalPayload.age}`,
          `Sex: ${finalPayload.sex}`,
          `Duration: ${finalPayload.symptom_duration}`,
        ].join(', '),

        // The 13-feature model intentionally uses pain_score: 0.
        // The existing report API, however, requires painScale to be 1-10.
        painScale: Math.max(1, finalPayload.pain_score),

        durationDays:
          finalPayload.symptom_duration === 'Today'
            ? 1
            : finalPayload.symptom_duration === 'Yesterday'
            ? 2
            : finalPayload.symptom_duration === '2–3 days'
            ? 3
            : 4,

        structuredInputs: finalPayload as any,

        // IMPORTANT:
        // This is what allows Node to forward the
        // website triage payload to FastAPI/XGBoost.
        triagePayload: finalPayload,
      });

      console.log(
        '[SymptomChecker] Node backend response:',
        response
      );

      const report = response?.data?.report;

      if (!report) {
        throw new Error(
          'No report was returned by the Node backend.'
        );
      }

      const aiPrediction = report.aiPrediction;

      console.log(
        '[SymptomChecker] AI prediction:',
        aiPrediction
      );

      /**
       * Prisma response normally contains:
       *
       * predictedSeverity
       *
       * The mock/fallback response may contain:
       *
       * predicted_severity
       *
       * or:
       *
       * triage_outcome
       *
       * We support all three.
       */
      const backendOutcome =
        normalizeOutcome(
          aiPrediction?.triage_outcome
        ) ||
        normalizeOutcome(
          aiPrediction?.predictedSeverity
        ) ||
        normalizeOutcome(
          aiPrediction?.predicted_severity
        );

      if (!backendOutcome) {
        console.error(
          '[SymptomChecker] Backend did not return a valid XGBoost triage outcome.',
          aiPrediction
        );

        throw new Error(
          'The AI triage service did not return a valid triage outcome.'
        );
      }

      console.log(
        '[SymptomChecker] Final XGBoost triage outcome:',
        backendOutcome
      );

      setOutcome(backendOutcome);
      setCurrentStep(4);
    } catch (error: any) {
      console.error(
        '[SymptomChecker] XGBoost triage assessment failed:',
        error
      );

      alert(
        error?.message ||
          'Unable to complete the AI triage assessment. Please make sure the Node backend and FastAPI AI service are running.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetAssessment = () => {
    setPayload({
      ...DEFAULT_PAYLOAD,
    });

    setOutcome(null);
    setWantAdditionalDetails(null);
    setShowPayloadInspector(false);
    setCurrentStep(1);
  };

  const getOutcomeDetails = (
    res: TriageOutcome
  ) => {
    switch (res) {
      case 'Emergency':
        return {
          title: 'Emergency',

          bannerBg:
            'bg-[#fb4903] text-white border border-[#000000]',

          badgeBg:
            'bg-[#ffd731] text-[#000000] border border-[#000000]',

          explanation:
            'Immediate medical attention is recommended.',

          icon: (
            <ShieldAlert className="h-10 w-10 text-[#ffd731] stroke-[2.5]" />
          ),

          primaryAction: {
            label: 'Trigger Emergency SOS',
            path: '/emergency',
            bg:
              'bg-[#ffffff] text-[#fb4903] hover:bg-slate-100',
          },
        };

      case 'Hospital Visit Required':
        return {
          title: 'Hospital Visit Required',

          bannerBg:
            'bg-[#ffd731] text-[#000000] border border-[#000000]',

          badgeBg:
            'bg-[#000000] text-white border border-[#000000]',

          explanation:
            'A hospital or medical centre visit is recommended for further evaluation.',

          icon: (
            <Activity className="h-10 w-10 text-[#000000] stroke-[2.5]" />
          ),

          primaryAction: {
            label: 'Book Clinic Visit',
            path: '/appointments',
            bg:
              'bg-[#000000] text-white hover:bg-[#333]',
          },
        };

      case 'Teleconsultation':
        return {
          title: 'Teleconsultation',

          bannerBg:
            'bg-[#4da2ff] text-white border border-[#000000]',

          badgeBg:
            'bg-[#e9ccff] text-[#000000] border border-[#000000]',

          explanation:
            'A remote consultation with a doctor may be appropriate.',

          icon: (
            <Stethoscope className="h-10 w-10 text-white stroke-[2.5]" />
          ),

          primaryAction: {
            label: 'Consult Doctor Online',
            path: '/appointments',
            bg:
              'bg-[#ffffff] text-[#000000] hover:bg-slate-100',
          },
        };

      case 'Self Care':
      default:
        return {
          title: 'Self Care',

          bannerBg:
            'bg-[#55db9c] text-[#000000] border border-[#000000]',

          badgeBg:
            'bg-[#ffffff] text-[#000000] border border-[#000000]',

          explanation:
            'Your symptoms may be suitable for basic self-care and monitoring. Seek medical attention if symptoms worsen.',

          icon: (
            <CheckCircle2 className="h-10 w-10 text-[#000000] stroke-[2.5]" />
          ),

          primaryAction: {
            label: 'Book Teleconsultation',
            path: '/appointments',
            bg:
              'bg-[#000000] text-white hover:bg-[#333]',
          },
        };
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto text-[#000000] font-sans">

      {/* ========================================================= */}
      {/* TOP HEADER */}
      {/* ========================================================= */}

      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">

        <div className="flex flex-wrap items-center justify-between gap-3">

          <div className="flex items-center gap-2.5 font-extrabold text-xl text-[#000000] tracking-tight font-['Space_Grotesk',sans-serif]">

            <div className="h-10 w-10 rounded-[1600px] bg-[#4da2ff] border border-[#000000] flex items-center justify-center text-white">

              <Stethoscope className="h-6 w-6 stroke-[2.5]" />

            </div>

            <span>
              AI Clinical Symptom Checker & Triage Assessment
            </span>

          </div>

          <span className="px-3.5 py-1.5 rounded-[1600px] text-xs font-bold bg-[#e9ccff] text-[#000000] border border-[#000000] flex items-center gap-1.5">

            <Sparkles className="h-3.5 w-3.5 text-[#5c4ade]" />

            XGBoost & MIMIC-IV Engine

          </span>

        </div>

        {/* Step Progress */}

        <div className="grid grid-cols-4 gap-2 pt-2">

          {[
            {
              step: 1,
              label: '1. Patient Info',
            },
            {
              step: 2,
              label: '2. Symptoms',
            },
            {
              step: 3,
              label: '3. Details',
            },
            {
              step: 4,
              label: '4. Triage Result',
            },
          ].map((s) => (
            <div
              key={s.step}
              className={`py-2 px-3 rounded-[1600px] text-center text-xs font-extrabold border border-[#000000] transition-colors ${
                currentStep === s.step
                  ? 'bg-[#ffd731] text-[#000000]'
                  : currentStep > s.step
                  ? 'bg-[#55db9c] text-[#000000]'
                  : 'bg-slate-100 text-slate-500 opacity-60'
              }`}
            >
              {s.label}
            </div>
          ))}

        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1 — PATIENT INFORMATION */}
      {/* ========================================================= */}

      {currentStep === 1 && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 shadow-none animate-fadeIn">

          <div className="space-y-1">

            <h2 className="text-2xl font-extrabold text-[#000000] font-['Space_Grotesk',sans-serif]">
              SECTION 1 — PATIENT INFORMATION
            </h2>

            <p className="text-xs font-bold text-[#000000] opacity-80">
              Provide basic patient details to calibrate clinical thresholds.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">

            {/* AGE */}

            <div className="space-y-2">

              <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                1. Age (Years)
              </label>

              <input
                type="number"
                min={1}
                max={120}
                value={payload.age}
                onChange={(e) =>
                  updatePayload(
                    'age',
                    Math.max(
                      1,
                      Math.min(
                        120,
                        parseInt(e.target.value) || 18
                      )
                    )
                  )
                }
                className="w-full p-3.5 rounded-[16px] bg-[#ffffff] border border-[#000000] text-sm font-extrabold text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#4da2ff]"
                required
              />

            </div>

            {/* SEX */}

            <div className="space-y-2">

              <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                2. Sex
              </label>

              <select
                value={payload.sex}
                onChange={(e) =>
                  updatePayload(
                    'sex',
                    e.target.value as
                      | 'Male'
                      | 'Female'
                      | 'Other'
                  )
                }
                className="w-full p-3.5 rounded-[16px] bg-[#ffffff] border border-[#000000] text-sm font-extrabold text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#4da2ff] cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

            </div>

            {/* DURATION */}

            <div className="space-y-2">

              <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                3. Symptom Duration
              </label>

              <select
                value={payload.symptom_duration}
                onChange={(e) =>
                  updatePayload(
                    'symptom_duration',
                    e.target.value as
                      | 'Today'
                      | 'Yesterday'
                      | '2–3 days'
                      | 'More than 3 days'
                  )
                }
                className="w-full p-3.5 rounded-[16px] bg-[#ffffff] border border-[#000000] text-sm font-extrabold text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#4da2ff] cursor-pointer"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="2–3 days">2–3 days</option>
                <option value="More than 3 days">
                  More than 3 days
                </option>
              </select>

            </div>

          </div>

          <div className="pt-4 flex justify-end">

            <button
              onClick={() => setCurrentStep(2)}
              className="px-8 py-3.5 rounded-[1600px] bg-[#000000] text-white text-xs font-extrabold border border-[#000000] hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-2 shadow-none"
            >

              <span>Continue to Symptoms</span>

              <ArrowRight className="h-4 w-4 text-[#ffd731]" />

            </button>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2 — SYMPTOM ASSESSMENT */}
      {/* ========================================================= */}

      {currentStep === 2 && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 shadow-none animate-fadeIn">

          <div className="space-y-1">

            <h2 className="text-2xl font-extrabold text-[#000000] font-['Space_Grotesk',sans-serif]">
              SECTION 2 — SYMPTOM ASSESSMENT
            </h2>

            <p className="text-sm font-bold text-[#000000]">
              Which symptoms are you experiencing?
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 pt-2">

            {SYMPTOM_LIST.map((item) => {

              const isSelected = payload[item.key];

              return (
                <div
                  key={item.key}
                  onClick={() => toggleSymptom(item.key)}
                  className={`p-4 rounded-[20px] border border-[#000000] cursor-pointer transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#55db9c] text-[#000000] transform scale-[1.02]'
                      : 'bg-[#ffffff] text-[#000000] hover:bg-slate-50'
                  }`}
                >

                  <div className="flex items-center gap-3">

                    <span className="text-2xl">
                      {item.icon}
                    </span>

                    <div>

                      <h3 className="text-sm font-extrabold">
                        {item.label}
                      </h3>

                      <span className="text-[10px] font-bold opacity-75 uppercase">
                        {item.category}
                      </span>

                    </div>

                  </div>

                  <div
                    className={`h-7 w-7 rounded-[1600px] border border-[#000000] flex items-center justify-center ${
                      isSelected
                        ? 'bg-[#000000] text-[#55db9c]'
                        : 'bg-[#ffffff] text-transparent'
                    }`}
                  >

                    <Check className="h-4 w-4 stroke-[3]" />

                  </div>

                </div>
              );
            })}

          </div>

          <div className="pt-4 flex items-center justify-between">

            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 rounded-[1600px] bg-[#ffffff] text-[#000000] border border-[#000000] text-xs font-bold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Back to Patient Info
            </button>

            <button
              onClick={() => setCurrentStep(3)}
              className="px-8 py-3.5 rounded-[1600px] bg-[#000000] text-white text-xs font-extrabold border border-[#000000] hover:bg-[#333333] transition-colors cursor-pointer flex items-center gap-2 shadow-none"
            >

              <span>Continue</span>

              <ArrowRight className="h-4 w-4 text-[#ffd731]" />

            </button>

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3 — ADDITIONAL DETAILS */}
      {/* ========================================================= */}

      {currentStep === 3 && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 shadow-none animate-fadeIn">

          <div className="space-y-1">

            <h2 className="text-2xl font-extrabold text-[#000000] font-['Space_Grotesk',sans-serif]">
              SECTION 3 — ADDITIONAL DETAILS
            </h2>

            <p className="text-xs font-bold text-[#000000] opacity-80">
              Optional clinical context for refined triage classification.
            </p>

          </div>

          {/* ===================================================== */}
          {/* OPTIONAL PROMPT */}
          {/* ===================================================== */}

          {wantAdditionalDetails === null ? (

            <div className="p-6 rounded-[20px] bg-[#e9ccff] border border-[#000000] space-y-5 text-center">

              <HelpCircle className="h-10 w-10 text-[#5c4ade] mx-auto stroke-[2.5]" />

              <p className="text-base font-extrabold text-[#000000]">
                Would you like to provide a few more details for a more detailed assessment?
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">

                <button
                  onClick={() => setWantAdditionalDetails(true)}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-xs font-extrabold hover:bg-[#45ca8b] cursor-pointer shadow-none transition-colors flex items-center justify-center gap-2"
                >

                  <Check className="h-4 w-4" />

                  <span>
                    Yes, Continue
                  </span>

                </button>

                <button
                  onClick={() => {
                    setWantAdditionalDetails(false);
                    handleGenerateAssessment(false);
                  }}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-[1600px] bg-[#000000] text-white border border-[#000000] text-xs font-extrabold hover:bg-[#333333] cursor-pointer shadow-none transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >

                  {isLoading ? (
                    <span>
                      Evaluating XGBoost Models...
                    </span>
                  ) : (
                    <>
                      <span>
                        No, Get Assessment
                      </span>

                      <ArrowRight className="h-4 w-4 text-[#ffd731]" />
                    </>
                  )}

                </button>

              </div>

            </div>

          ) : (

            /* =================================================== */
            /* DETAILED INPUTS */
            /* =================================================== */

            <div className="space-y-6 pt-2">

              {/* MAIN COMPLAINT */}

              <div className="space-y-2">

                <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                  A. What is your main health concern?
                </label>

                <select
                  value={
                    payload.main_complaint ||
                    MAIN_COMPLAINT_OPTIONS[0]
                  }
                  onChange={(e) =>
                    updatePayload(
                      'main_complaint',
                      e.target.value
                    )
                  }
                  className="w-full p-3.5 rounded-[16px] bg-[#ffffff] border border-[#000000] text-sm font-extrabold text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#5c4ade] cursor-pointer"
                >

                  {MAIN_COMPLAINT_OPTIONS.map(
                    (opt) => (
                      <option
                        key={opt}
                        value={opt}
                      >
                        {opt}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* MENTAL STATUS */}

              <div className="space-y-2">

                <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider block">
                  B. How are you feeling mentally right now?
                </label>

                <select
                  value={
                    payload.mental_status ||
                    'Alert'
                  }
                  onChange={(e) =>
                    updatePayload(
                      'mental_status',
                      e.target.value
                    )
                  }
                  className="w-full p-3.5 rounded-[16px] bg-[#ffffff] border border-[#000000] text-sm font-extrabold text-[#000000] focus:outline-none focus:ring-2 focus:ring-[#5c4ade] cursor-pointer"
                >

                  {MENTAL_STATUS_OPTIONS.map(
                    (opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                      >
                        {opt.label}
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* PAIN SCORE */}

              <div className="space-y-3">

                <div className="flex justify-between items-center">

                  <label className="text-xs font-extrabold text-[#000000] uppercase tracking-wider">
                    C. How severe is your pain? (0–10)
                  </label>

                  <span className="px-3 py-1 rounded-[1600px] text-xs font-black bg-[#ffd731] text-[#000000] border border-[#000000]">
                    Score: {payload.pain_score} / 10
                  </span>

                </div>

                <input
                  type="range"
                  min={0}
                  max={10}
                  value={payload.pain_score}
                  onChange={(e) =>
                    updatePayload(
                      'pain_score',
                      parseInt(e.target.value) || 0
                    )
                  }
                  className="w-full h-3 rounded-[1600px] bg-slate-200 accent-[#fb4903] border border-[#000000] cursor-pointer"
                />

                <div className="flex justify-between text-[11px] font-bold text-[#000000]">

                  <span>
                    0 = No pain
                  </span>

                  <span>
                    5 = Moderate
                  </span>

                  <span>
                    10 = Worst pain
                  </span>

                </div>

              </div>

              <div className="pt-4 flex items-center justify-between">

                <button
                  onClick={() =>
                    setWantAdditionalDetails(null)
                  }
                  className="px-6 py-3 rounded-[1600px] bg-[#ffffff] text-[#000000] border border-[#000000] text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Back
                </button>

                <button
                  onClick={() =>
                    handleGenerateAssessment(true)
                  }
                  disabled={isLoading}
                  className="px-8 py-3.5 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-xs font-extrabold hover:bg-[#45ca8b] cursor-pointer shadow-none flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >

                  {isLoading ? (

                    <span>
                      Evaluating XGBoost Models...
                    </span>

                  ) : (

                    <>
                      <Sparkles className="h-4 w-4 text-[#000000]" />

                      <span>
                        Get Assessment
                      </span>
                    </>

                  )}

                </button>

              </div>

            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 4 — AI TRIAGE RESULT */}
      {/* ========================================================= */}

      {currentStep === 4 && outcome && (

        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 shadow-none animate-scaleUp">

          <div className="flex items-center justify-between border-b border-[#000000] pb-4">

            <h2 className="text-2xl font-extrabold text-[#000000] font-['Space_Grotesk',sans-serif]">
              SECTION 4 — AI TRIAGE RESULT
            </h2>

            <span className="text-xs font-bold bg-[#e9ccff] px-3.5 py-1 rounded-[1600px] border border-[#000000]">
              XGBoost Assessment Complete
            </span>

          </div>

          {/* OUTCOME */}

          {(() => {

            const details =
              getOutcomeDetails(outcome);

            return (

              <div
                className={`p-6 rounded-[24px] ${details.bannerBg} space-y-4`}
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    {details.icon}

                    <div>

                      <span
                        className={`px-3 py-1 rounded-[1600px] text-xs font-black uppercase ${details.badgeBg}`}
                      >
                        Your AI Triage Assessment
                      </span>

                      <h3 className="text-3xl font-extrabold mt-1 font-['Space_Grotesk',sans-serif]">
                        {details.title}
                      </h3>

                    </div>

                  </div>

                </div>

                <p className="text-base font-extrabold leading-relaxed">
                  {details.explanation}
                </p>

                <div className="pt-2 flex flex-wrap gap-3">

                  <button
                    onClick={() =>
                      navigate(
                        details.primaryAction.path
                      )
                    }
                    className={`px-6 py-3 rounded-[1600px] border border-[#000000] text-xs font-black cursor-pointer shadow-none flex items-center gap-2 ${details.primaryAction.bg}`}
                  >

                    <span>
                      {details.primaryAction.label}
                    </span>

                    <ArrowRight className="h-4 w-4" />

                  </button>

                  <button
                    onClick={resetAssessment}
                    className="px-6 py-3 rounded-[1600px] bg-[#ffffff] text-[#000000] border border-[#000000] text-xs font-extrabold hover:bg-slate-100 cursor-pointer shadow-none flex items-center gap-2"
                  >

                    <RotateCcw className="h-4 w-4 text-[#fb4903]" />

                    <span>
                      Start New Assessment
                    </span>

                  </button>

                </div>

              </div>

            );

          })()}

          {/* DISCLAIMER */}

          <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] flex items-start gap-3 text-xs text-[#000000]">

            <Info className="h-5 w-5 text-[#000000] shrink-0 mt-0.5" />

            <div>

              <strong className="font-extrabold block mb-0.5 uppercase tracking-wide">
                Medical Disclaimer:
              </strong>

              This is an AI-assisted triage assessment,
              not a medical diagnosis. If symptoms are
              severe or rapidly worsening, seek immediate
              medical attention.

            </div>

          </div>

          {/* PAYLOAD INSPECTOR */}

          <div className="pt-2 border-t border-slate-200">

            <button
              type="button"
              onClick={() =>
                setShowPayloadInspector(
                  !showPayloadInspector
                )
              }
              className="text-xs font-extrabold text-[#5c4ade] underline cursor-pointer flex items-center gap-1"
            >

              <span>
                {showPayloadInspector
                  ? 'Hide'
                  : 'Inspect'}{' '}
                16-Value Data Structure
              </span>

            </button>

            {showPayloadInspector && (

              <pre className="mt-3 p-4 rounded-[16px] bg-[#000000] text-[#55db9c] text-xs font-mono overflow-x-auto border border-[#000000]">
                {JSON.stringify(
                  payload,
                  null,
                  2
                )}
              </pre>

            )}

          </div>

        </div>

      )}

    </div>
  );
};
