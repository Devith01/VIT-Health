import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, Calendar, HeartPulse, ShieldCheck, Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FacultyDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 text-[#000000]">
      {/* Header Banner */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#e9ccff] text-[#000000] border border-[#000000]">
              FACULTY HEALTHCARE PORTAL
            </span>
            <span className="text-xs text-[#000000] font-bold uppercase tracking-wider">Employee ID: VIT-FAC-1004</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">Welcome, {user?.fullName || 'Prof. Rajesh Kumar'}</h2>
          <p className="text-xs text-[#000000] max-w-xl font-medium">
            Access your personal healthcare services, schedule doctor teleconsultations, complete confidential wellness screenings, and manage personal prescriptions.
          </p>
        </div>

        <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] flex items-center gap-2 shrink-0 text-xs text-[#000000] font-extrabold">
          <ShieldCheck className="h-4 w-4" />
          <span>Personal Medical Isolation Active</span>
        </div>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div
          onClick={() => navigate('/symptoms')}
          className="p-6 rounded-[30px] bg-[#ffffff] border border-[#000000] hover:bg-[#dceeff] transition-all cursor-pointer space-y-3 shadow-none group"
        >
          <div className="h-10 w-10 rounded-[1600px] bg-[#e9ccff] text-[#000000] border border-[#000000] flex items-center justify-center font-bold">
            <Stethoscope className="h-5 w-5 stroke-[2.5]" />
          </div>
          <h3 className="font-extrabold text-[#000000] text-base font-['Space_Grotesk']">AI Symptom Checker</h3>
          <p className="text-xs text-[#000000] font-medium">Evaluate symptoms with NLP extractions, Neural Net disease rankings, and XAI summaries.</p>
        </div>

        <div
          onClick={() => navigate('/appointments')}
          className="p-6 rounded-[30px] bg-[#ffffff] border border-[#000000] hover:bg-[#dceeff] transition-all cursor-pointer space-y-3 shadow-none group"
        >
          <div className="h-10 w-10 rounded-[1600px] bg-[#ffd731] text-[#000000] border border-[#000000] flex items-center justify-center font-bold">
            <Calendar className="h-5 w-5 stroke-[2.5]" />
          </div>
          <h3 className="font-extrabold text-[#000000] text-base font-['Space_Grotesk']">Faculty Appointments</h3>
          <p className="text-xs text-[#000000] font-medium">Schedule In-Person appointments or video teleconsultations with campus physicians.</p>
        </div>

        <div
          onClick={() => navigate('/pharmacy')}
          className="p-6 rounded-[30px] bg-[#ffffff] border border-[#000000] hover:bg-[#dceeff] transition-all cursor-pointer space-y-3 shadow-none group"
        >
          <div className="h-10 w-10 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] flex items-center justify-center font-bold">
            <Pill className="h-5 w-5 stroke-[2.5]" />
          </div>
          <h3 className="font-extrabold text-[#000000] text-base font-['Space_Grotesk']">Medicine Ordering</h3>
          <p className="text-xs text-[#000000] font-medium">Order prescribed medications directly from the campus pharmacy with OTP verification.</p>
        </div>
      </div>

      {/* Personal Health Records Overview */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
        <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-[#5c4ade] stroke-[2.5]" />
          Personal Health Summary & Consultations
        </h3>
        <div className="p-5 rounded-[20px] bg-[#dceeff] border border-[#000000] text-xs text-[#000000] space-y-2 font-bold">
          <p className="text-[#000000] font-bold">
            <strong>Active Consultations:</strong> 1 Scheduled Teleconsultation with Dr. Vikramaditya Sen.
          </p>
          <p className="text-[#000000] font-medium">
            Faculty medical records are strictly confidential and protected by personal data isolation rules.
          </p>
        </div>
      </div>
    </div>
  );
};
