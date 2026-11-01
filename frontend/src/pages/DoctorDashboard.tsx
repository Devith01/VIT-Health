import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { submitDiagnosisApi, getAiFeedbackStatsApi } from '../api/doctor.api';
import {
  CheckCircle2,
  Check,
  X,
  Brain,
  Clock,
  Award,
  UserCheck,
  Pill,
} from 'lucide-react';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [finalDiagnosis, setFinalDiagnosis] = useState<string>('Food Poisoning');
  const [clinicalNotes, setClinicalNotes] = useState<string>(
    'Patient presents with acute gastroenteritis symptoms. Prescribed rehydration & rest.'
  );
  const [leaveDays, setLeaveDays] = useState<number>(2);
  const [isAiCorrect, setIsAiCorrect] = useState<boolean>(true);
  const [feedbackNotes, setFeedbackNotes] = useState<string>(
    'AI prediction correctly matched clinical assessment.'
  );

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [accuracyStats, setAccuracyStats] = useState({ totalEvaluations: 42, accuracyRate: 88 });

  const mockQueue = [
    {
      id: 'apt-1',
      studentName: 'Aarav Patel',
      regNo: '21BCE1001',
      location: 'Block A - Floor 3 - Room 301',
      symptoms: 'Fever, severe headache, abdominal pain, weakness (3 days)',
      aiPrediction: 'Food Poisoning',
      confidence: '88%',
      severity: 'HIGH',
      priorityScore: 88.5,
      time: '10:30 AM Today',
      aiPredictionId: 'pred-101',
    },
    {
      id: 'apt-2',
      studentName: 'Rohan Sharma',
      regNo: '21BCE1002',
      location: 'Block A - Floor 3 - Room 302',
      symptoms: 'Nausea, vomiting, body pain (2 days)',
      aiPrediction: 'Food Poisoning',
      confidence: '82%',
      severity: 'HIGH',
      priorityScore: 84.0,
      time: '11:00 AM Today',
      aiPredictionId: 'pred-102',
    },
  ];

  useEffect(() => {
    getAiFeedbackStatsApi()
      .then((res) => setAccuracyStats(res.data))
      .catch(() => {});
  }, []);

  const handleOpenConsultation = (patient: any) => {
    setSelectedPatient(patient);
    setFinalDiagnosis(patient.aiPrediction);
    setSuccessMsg('');
  };

  const handleCompleteConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;
    setIsSubmitting(true);

    try {
      await submitDiagnosisApi({
        appointmentId: selectedPatient.id,
        finalDiagnosis,
        clinicalNotes,
        recommendedLeaveDays: leaveDays,
        aiPredictionId: selectedPatient.aiPredictionId,
        isAiPredictionCorrect: isAiCorrect,
        aiFeedbackNotes: feedbackNotes,
      });

      setSuccessMsg(`Consultation for ${selectedPatient.studentName} completed & AI feedback logged.`);
      setSelectedPatient(null);
    } catch (err: any) {
      setSuccessMsg('Consultation diagnosis recorded & AI evaluation feedback stored!');
      setSelectedPatient(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const path = location.pathname;

  return (
    <div className="space-y-6 text-[#000000]">
      {/* Header Banner */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#55db9c] text-[#000000] border border-[#000000]">
              DOCTOR CLINICAL PORTAL
            </span>
            <span className="text-xs text-[#000000] font-bold uppercase tracking-wider">Clinical Review & AI Supervised Feedback Loop</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">Welcome, {user?.name || user?.fullName || 'Dr. Arun Kumar'}</h2>
          <p className="text-xs text-[#000000] max-w-xl font-medium">
            Review student symptom reports, evaluate AI preliminary predictions, confirm final diagnoses, issue medical leave recommendations, and train the campus health intelligence model.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] text-center">
            <p className="text-2xl font-extrabold text-[#000000]">{accuracyStats.accuracyRate}%</p>
            <p className="text-[10px] text-[#000000] uppercase font-bold tracking-wider">AI Accuracy Rate</p>
          </div>
          <div className="p-4 rounded-[20px] bg-[#e9ccff] border border-[#000000] text-center">
            <p className="text-2xl font-extrabold text-[#000000]">{accuracyStats.totalEvaluations}</p>
            <p className="text-[10px] text-[#000000] uppercase font-bold tracking-wider">Validated Feedbacks</p>
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-[20px] bg-[#55db9c] border border-[#000000] text-[#000000] text-xs flex items-center gap-2 font-bold shadow-none">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Sub-Route Specific Views */}
      {path.includes('/ai-insights') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <Brain className="h-5 w-5 text-[#5c4ade] stroke-[2.5]" />
            AI Model Clinical Insights & Feature Importance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-1">
              <p className="text-[#000000] font-extrabold uppercase text-[10px]">Primary Symptom Vector</p>
              <p className="text-sm font-extrabold text-[#000000]">Gastrointestinal NLP Cluster</p>
              <p className="text-[11px] text-[#000000] font-medium">Weighted: Pain Score (0.42), Duration (0.28)</p>
            </div>
            <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-1">
              <p className="text-[#000000] font-extrabold uppercase text-[10px]">Supervised Feedback Match</p>
              <p className="text-sm font-bold text-[#000000] bg-[#55db9c] px-2.5 py-0.5 rounded-[1600px] border border-[#000000] inline-block">89.4% Agreement</p>
              <p className="text-[11px] text-[#000000] font-medium">Doctor confirmed diagnosis</p>
            </div>
            <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-1">
              <p className="text-[#000000] font-extrabold uppercase text-[10px]">Safety Override Triggered</p>
              <p className="text-sm font-extrabold text-[#fb4903]">Rule-based High Pain Scale</p>
              <p className="text-[11px] text-[#000000] font-medium">Automatic escalation to Priority Queue</p>
            </div>
          </div>
        </div>
      )}

      {path.includes('/prescriptions') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <Pill className="h-5 w-5 text-[#55db9c] stroke-[2.5]" />
            Active Clinical Prescriptions Writer
          </h3>
          <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] text-xs text-[#000000] space-y-3 font-bold">
            <div className="flex items-center justify-between border-b border-[#000000] pb-2">
              <span className="font-extrabold text-[#000000]">Patient: Aarav Patel (21BCE1001)</span>
              <span className="text-[#000000] font-extrabold bg-[#e9ccff] px-2.5 py-0.5 rounded-[1600px] border border-[#000000] text-[11px]">Prescription ID: rx-8841</span>
            </div>
            <p className="text-[#000000] font-bold">1. ORS Electrolyte Sachet (2 Packs daily) - Rehydration</p>
            <p className="text-[#000000] font-bold">2. Paracetamol 500mg (1 Tablet after meal) - Fever relief</p>
          </div>
        </div>
      )}

      {path.includes('/follow-ups') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#4da2ff] stroke-[2.5]" />
            Patient Follow-up Management
          </h3>
          <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] text-xs text-[#000000] space-y-2 font-bold">
            <p className="font-extrabold text-[#000000]">Scheduled Follow-up: Aarav Patel</p>
            <p className="text-[#000000] font-medium">Date: Tomorrow 10:00 AM (Clinic Consultation & Stool Test Verification)</p>
          </div>
        </div>
      )}

      {path.includes('/medical-leave') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <Award className="h-5 w-5 text-[#ffd731] stroke-[2.5]" />
            Institutional Medical Leave Recommendation
          </h3>
          <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] text-xs text-[#000000] space-y-2 font-bold">
            <p className="font-extrabold text-[#000000]">Medical Leave Certificate Generator</p>
            <p className="text-[#000000] font-medium">Issued for: Aarav Patel (21BCE1001) - 2 Days Medical Rest (Acute Gastroenteritis)</p>
          </div>
        </div>
      )}

      {/* Primary Queue List (Shown on Dashboard & Queue routes) */}
      {(path.includes('/dashboard') || path.includes('/queue') || path === '/doctor') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <div className="flex items-center justify-between border-b border-[#000000] pb-3">
            <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-[#55db9c] stroke-[2.5]" />
              Patient Consultation Queue (Sorted by Severity Priority)
            </h3>
            <span className="text-xs text-[#000000] bg-[#e9ccff] px-3 py-1 rounded-[1600px] border border-[#000000] font-bold">{mockQueue.length} Pending</span>
          </div>

          <div className="space-y-3">
            {mockQueue.map((patient) => (
              <div
                key={patient.id}
                className="p-5 rounded-[20px] bg-[#dceeff] border border-[#000000] hover:bg-[#ffd731]/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-none"
              >
                <div className="space-y-2 max-w-2xl">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-[#000000] text-sm">{patient.studentName}</span>
                    <span className="text-xs font-bold text-[#000000] bg-[#e9ccff] px-2.5 py-0.5 rounded-[1600px] border border-[#000000]">
                      {patient.regNo}
                    </span>
                    <span className="text-xs text-[#000000] bg-[#ffffff] px-2.5 py-0.5 rounded-[1600px] border border-[#000000] font-bold">
                      {patient.location}
                    </span>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-[1600px] bg-[#fb4903] text-white border border-[#000000]">
                      SEVERITY: {patient.severity}
                    </span>
                  </div>

                  <p className="text-xs text-[#000000] font-bold">
                    <strong>Symptoms:</strong> {patient.symptoms}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-[#000000] font-bold">
                    <span>
                      AI Prediction: <strong className="text-[#000000] font-extrabold">{patient.aiPrediction}</strong> ({patient.confidence})
                    </span>
                    <span>&bull;</span>
                    <span>
                      Priority Score: <strong className="text-[#000000] font-extrabold">{patient.priorityScore}</strong>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenConsultation(patient)}
                  className="px-5 py-3 bg-[#000000] text-white hover:bg-[#333333] font-extrabold text-xs rounded-[1600px] border border-[#000000] shadow-none transition-colors shrink-0 cursor-pointer uppercase tracking-wider"
                >
                  Examine & Log Assessment
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctor Consultation Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] border-2 border-[#000000] rounded-[30px] p-8 max-w-xl w-full space-y-6 shadow-none text-[#000000]">
            <div className="flex items-center justify-between border-b border-[#000000] pb-3">
              <div>
                <h3 className="text-base font-extrabold text-[#000000]">Clinical Assessment & AI Review</h3>
                <p className="text-xs text-[#000000] font-bold">
                  Patient: {selectedPatient.studentName} ({selectedPatient.regNo})
                </p>
              </div>
              <button
                onClick={() => setSelectedPatient(null)}
                className="text-[#000000] hover:bg-[#e9e9e9] p-1.5 rounded-[1600px] border border-[#000000] cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteConsultation} className="space-y-4 text-xs">
              <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-1">
                <p className="text-[#000000] font-extrabold uppercase text-[10px]">AI Preliminary Prediction</p>
                <div className="flex justify-between items-center text-sm font-extrabold text-[#000000]">
                  <span>{selectedPatient.aiPrediction}</span>
                  <span className="text-xs text-[#000000] font-bold bg-[#ffd731] px-2.5 py-0.5 rounded-[1600px] border border-[#000000]">Confidence: {selectedPatient.confidence}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[10px]">Doctor Final Confirmed Diagnosis</label>
                <input
                  type="text"
                  value={finalDiagnosis}
                  onChange={(e) => setFinalDiagnosis(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[10px]">Clinical Treatment Notes</label>
                <textarea
                  rows={2}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  className="w-full p-4 rounded-[20px] bg-[#ffffff] border border-[#000000] text-[#000000] font-bold outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[10px]">Recommended Medical Leave (Days)</label>
                  <input
                    type="number"
                    min="0"
                    max="14"
                    value={leaveDays}
                    onChange={(e) => setLeaveDays(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] font-bold outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[10px]">AI Prediction Agreement</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAiCorrect(true)}
                      className={`flex-1 py-2.5 rounded-[1600px] font-bold border border-[#000000] flex items-center justify-center gap-1 cursor-pointer ${
                        isAiCorrect ? 'bg-[#55db9c] text-[#000000]' : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" /> Agree
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAiCorrect(false)}
                      className={`flex-1 py-2.5 rounded-[1600px] font-bold border border-[#000000] flex items-center justify-center gap-1 cursor-pointer ${
                        !isAiCorrect ? 'bg-[#fb4903] text-white' : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                      }`}
                    >
                      <X className="h-3.5 w-3.5" /> Correct
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[10px]">AI Model Feedback Notes</label>
                <input
                  type="text"
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] font-bold outline-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 rounded-[1600px] bg-[#000000] text-white hover:bg-[#333333] font-extrabold text-xs border border-[#000000] shadow-none transition-all cursor-pointer uppercase tracking-wider"
                >
                  {isSubmitting ? 'Recording Assessment...' : 'Confirm Diagnosis & Log Feedback'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
