import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MentalHealthAnswers,
  MentalHealthScreeningResult,
  submitMentalHealthScreeningApi,
} from '../api/mentalHealth.api';
import { Brain, CheckCircle2, HeartPulse, Lock, RotateCcw, ShieldCheck } from 'lucide-react';

type Question = {
  id: keyof MentalHealthAnswers;
  question: string;
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  valueLabel: (value: number) => string;
};

const DEFAULT_ANSWERS: MentalHealthAnswers = {
  age: 20, study_hours: 5, exam_pressure: 6, academic_performance: 75,
  stress_level: 5, anxiety_frequency: 3, depressive_feelings: 2,
  sleep_hours: 7, physical_activity: 3, social_support: 7, screen_hours: 5,
  internet_hours: 6, financial_stress: 3, family_pressure: 5, academic_exhaustion: 4,
};

const QUESTIONS: Question[] = [
  { id: 'age', question: 'What is your age?', min: 17, max: 29, minLabel: '17 years', maxLabel: '29 years', valueLabel: v => `${v} years` },
  { id: 'study_hours', question: 'How many hours do you study per day?', min: 0, max: 12, minLabel: '0 hours', maxLabel: '12 hours', valueLabel: v => `${v} hrs/day` },
  { id: 'exam_pressure', question: 'How much exam pressure do you feel?', min: 0, max: 10, minLabel: '0 (None)', maxLabel: '10 (Extreme)', valueLabel: v => `${v} / 10` },
  { id: 'academic_performance', question: 'How would you rate your academic performance?', min: 0, max: 100, minLabel: '0% (Needs Improvement)', maxLabel: '100% (Excellent)', valueLabel: v => `${v} %` },
  { id: 'stress_level', question: 'How would you rate your current stress level?', min: 0, max: 10, minLabel: '0 (Very Low)', maxLabel: '10 (Severe)', valueLabel: v => `${v} / 10` },
  { id: 'anxiety_frequency', question: 'How often do you feel anxious or worried?', min: 0, max: 8, minLabel: '0 (Never)', maxLabel: '8 (Always)', valueLabel: v => `${v} / 8` },
  { id: 'depressive_feelings', question: 'How often do you experience depressive feelings or low mood?', min: 0, max: 6, minLabel: '0 (Never)', maxLabel: '6 (Very Frequent)', valueLabel: v => `${v} / 6` },
  { id: 'sleep_hours', question: 'How many hours do you sleep per night?', min: 3, max: 10, minLabel: '3 hrs (Severe Insomnia)', maxLabel: '10 hrs (Restful)', valueLabel: v => `${v} hrs/night` },
  { id: 'physical_activity', question: 'How much physical activity do you get each day?', min: 0, max: 8, minLabel: '0 (Sedentary)', maxLabel: '8 (Highly Active)', valueLabel: v => `${v} / 8` },
  { id: 'social_support', question: 'How much social/emotional support do you feel you have?', min: 0, max: 10, minLabel: '0 (Isolated)', maxLabel: '10 (Strong Support)', valueLabel: v => `${v} / 10` },
  { id: 'screen_hours', question: 'How many hours do you spend on screens per day?', min: 1, max: 12, minLabel: '1 hour', maxLabel: '12 hours', valueLabel: v => `${v} hrs/day` },
  { id: 'internet_hours', question: 'How many hours do you use the internet per day?', min: 1, max: 13, minLabel: '1 hour', maxLabel: '13 hours', valueLabel: v => `${v} hrs/day` },
  { id: 'financial_stress', question: 'How much financial stress are you experiencing?', min: 0, max: 10, minLabel: '0 (No Stress)', maxLabel: '10 (High Stress)', valueLabel: v => `${v} / 10` },
  { id: 'family_pressure', question: 'How much pressure do you feel from family expectations?', min: 0, max: 10, minLabel: '0 (No Pressure)', maxLabel: '10 (High Pressure)', valueLabel: v => `${v} / 10` },
  { id: 'academic_exhaustion', question: 'How physically or mentally exhausted do you feel because of your studies?', min: 0, max: 10, minLabel: '0 (Fresh)', maxLabel: '10 (Burnt Out)', valueLabel: v => `${v} / 10` },
];

export const MentalHealthPage: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<MentalHealthAnswers>(DEFAULT_ANSWERS);
  const [result, setResult] = useState<MentalHealthScreeningResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateAnswer = (id: keyof MentalHealthAnswers, value: number) => {
    setAnswers(previous => ({ ...previous, [id]: value }));
  };

  const resetQuestionnaire = () => {
    setAnswers(DEFAULT_ANSWERS);
    setResult(null);
    setSubmitError(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setSubmitError(null);
    try {
      const response = await submitMentalHealthScreeningApi(answers);
      setResult(response.data.screening);
    } catch (error: any) {
      setSubmitError(error?.response?.data?.message || error?.message || 'Prediction unavailable. Please ensure the backend and AI service are running.');
    } finally {
      setIsLoading(false);
    }
  };

  const resultColor = result?.prediction === 'High'
    ? 'bg-[#fb4903] text-white'
    : result?.prediction === 'Medium'
      ? 'bg-[#ffd731] text-[#000000]'
      : 'bg-[#55db9c] text-[#000000]';

  const guidance = result?.prediction === 'High'
    ? 'Please meet the college mental-health counselor as soon as possible for confidential support.'
    : result?.prediction === 'Medium'
      ? 'We recommend meeting the college mental-health counselor for confidential support.'
      : 'No counselor visit is currently recommended based on this screening result.';

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-12 text-[#000000]">
      <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] shadow-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap"><span className="px-2.5 py-0.5 rounded-[1600px] text-[10px] font-bold bg-[#e9ccff] text-[#000000] border border-[#000000]">CONFIDENTIAL WELLNESS</span><span className="text-[10px] text-[#000000] font-bold uppercase tracking-wider">VIT-Health Student Tele-Wellness</span></div>
          <h2 className="text-2xl font-extrabold text-[#000000] flex items-center gap-2 font-['Space_Grotesk']"><Brain className="h-6 w-6 text-[#5c4ade] stroke-[2.5]" />Mental Health & Stress Assessment</h2>
          <p className="text-[11px] text-[#000000] max-w-2xl font-medium">Answer all 15 questions for an AI-assisted academic lifestyle and mental-health assessment.</p>
        </div>
        <div className="p-3 rounded-[14px] bg-[#ffd731] border border-[#000000] flex items-center gap-2 shrink-0 text-[11px] text-[#000000] font-extrabold"><Lock className="h-4 w-4" /><span>Data Safe & Private</span></div>
      </div>

      <div className="p-3 rounded-[16px] bg-[#ffffff] border border-[#000000] flex items-start gap-2.5 text-[10px] text-[#000000] font-bold shadow-none"><ShieldCheck className="h-4 w-4 text-[#55db9c] shrink-0" /><span><strong>Confidentiality Guarantee:</strong> Your responses are evaluated privately for an AI-assisted wellbeing screening and do not represent a medical diagnosis.</span></div>

      {result ? (
        <section className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <div className="flex items-center gap-3 border-b border-[#000000] pb-3"><div className="p-2 rounded-[1600px] bg-[#dceeff] border border-[#000000]"><CheckCircle2 className="h-5 w-5 text-[#5c4ade] stroke-[2.5]" /></div><div><h3 className="text-sm font-extrabold">XGBoost Assessment Complete</h3><p className="text-[11px] font-bold">Prediction returned by the trained mental-health model</p></div></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3"><div className="p-4 rounded-[16px] bg-[#dceeff] border border-[#000000] space-y-2"><span className="text-[10px] font-bold uppercase">Model Prediction</span><div><span className={`inline-block px-3 py-1 rounded-[1600px] border border-[#000000] text-xs font-black ${resultColor}`}>{result.prediction} Concern</span></div></div><div className="p-4 rounded-[16px] bg-[#dceeff] border border-[#000000] space-y-2"><span className="text-[10px] font-bold uppercase">Model Confidence</span><p className="text-xl font-extrabold">{(result.confidence * 100).toFixed(1)}%</p></div></div>
          <div className="p-4 rounded-[16px] bg-[#ffd731] border border-[#000000] text-xs font-bold">{result.counselorNote || guidance}</div>
          <p className="text-[11px] font-medium text-[#000000]">{result.disclaimer}</p>
          {result.prediction !== 'Low' && (
            <button
              type="button"
              onClick={() => navigate('/appointments')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-[1600px] bg-[#000000] text-white border border-[#000000] text-xs font-extrabold hover:bg-[#333333] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Book Counselor Appointment</span>
            </button>
          )}
          <button type="button" onClick={resetQuestionnaire} className="px-5 py-2.5 rounded-[1600px] bg-[#ffffff] text-[#000000] border border-[#000000] text-xs font-extrabold hover:bg-slate-100 cursor-pointer flex items-center gap-2"><RotateCcw className="h-4 w-4 text-[#fb4903]" /><span>Retake Questionnaire</span></button>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 rounded-[20px] bg-[#ffffff] border border-[#000000] space-y-3 shadow-none">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#000000]"><h3 className="text-[11px] font-extrabold text-[#000000] uppercase tracking-wider flex items-center gap-2"><HeartPulse className="h-4 w-4 text-[#5c4ade] stroke-[2.5]" />Mental Health & Academic Lifestyle Questions</h3><span className="text-[10px] font-bold bg-[#ffd731] px-2.5 py-1 rounded-[1600px] border border-[#000000] whitespace-nowrap">15 Questions</span></div>
          <div className="space-y-2.5">{QUESTIONS.map((question, index) => (<fieldset key={question.id} className="p-3.5 sm:p-4 rounded-[14px] bg-[#dceeff] border border-[#000000] space-y-3"><div className="flex items-start justify-between gap-3"><div className="flex items-start gap-2.5 min-w-0"><span className="mt-0.5 px-2 py-0.5 rounded-[1600px] bg-[#ffffff] text-[#000000] font-black text-[10px] border border-[#000000] shrink-0">Q{index + 1}</span><label htmlFor={question.id} className="text-xs sm:text-sm font-extrabold text-[#000000] leading-snug">{question.question}</label></div><output htmlFor={question.id} className="px-2.5 py-1 rounded-[1600px] text-[10px] font-black bg-[#ffd731] text-[#000000] border border-[#000000] whitespace-nowrap shrink-0">{question.valueLabel(answers[question.id])}</output></div><input id={question.id} type="range" min={question.min} max={question.max} step={1} value={answers[question.id]} onChange={event => updateAnswer(question.id, Number(event.target.value))} className="w-full h-2.5 rounded-[1600px] bg-slate-200 accent-[#5c4ade] border border-[#000000] cursor-pointer" /><div className="flex justify-between gap-4 text-[9px] sm:text-[10px] font-bold text-[#000000]"><span>{question.minLabel}</span><span className="text-right">{question.maxLabel}</span></div><div className="text-center"><span className="inline-block px-2 py-0.5 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[9px] font-bold">Selected: {question.valueLabel(answers[question.id])}</span></div></fieldset>))}</div>
          {submitError && <div role="alert" className="p-3 rounded-[14px] bg-[#fb4903] text-white border border-[#000000] text-xs font-bold">Prediction unavailable: {submitError}</div>}
          <button type="submit" disabled={isLoading} className="w-full py-3.5 rounded-[1600px] bg-[#000000] text-white hover:bg-[#333333] font-extrabold text-xs border border-[#000000] shadow-none transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"><CheckCircle2 className="h-4 w-4 text-[#ffd731]" /><span>{isLoading ? 'Running XGBoost Assessment...' : 'Submit Assessment'}</span></button>
        </form>
      )}
    </div>
  );
};
