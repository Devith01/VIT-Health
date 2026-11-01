import React, { useState } from 'react';
import { useAuth, getStudentMedicalAttributes } from '../context/AuthContext';
import { Stethoscope, Calendar, ShieldAlert, Clock, Building, X, Check, Sparkles, HeartPulse, ArrowRight, Zap, Award, MapPin, FileText, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const [sosActive, setSosActive] = useState(false);

  const roomInfo = user?.studentProfile?.room;
  const currentBlock =
    user?.hostelBlock ||
    roomInfo?.floor?.block?.hostel?.name ||
    roomInfo?.floor?.block?.name ||
    'Boys Hostel 1';
  const currentRoom =
    user?.roomNumber ||
    roomInfo?.roomNum ||
    '301';
  const currentFloor =
    roomInfo?.floor?.floorNum ||
    parseInt(currentRoom.replace(/\D/g, '')[0]) ||
    1;

  const medicalAttrs = getStudentMedicalAttributes(user?.email || '');
  const currentRegNo =
    user?.registrationNumber ||
    user?.studentProfile?.registrationNo ||
    medicalAttrs.registrationNo;
  const studentDisplayName =
    user?.fullName ||
    user?.name ||
    (currentRegNo ? `Student ${currentRegNo}` : 'Student');

  return (
    <div className="space-y-8 bg-[#dceeff] text-[#000000] font-sans">
      {/* Hero Section */}
      <div className="p-8 md:p-12 rounded-[40px] bg-[#ffffff] border border-[#000000] space-y-6 relative overflow-hidden">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#55db9c] text-[#000000] border border-[#000000]">
                STUDENT HEALTHCARE PORTAL
              </span>
              <span className="text-xs font-bold text-[#000000]">Reg No: {currentRegNo}</span>
            </div>

            <button
              onClick={handleLogout}
              title="Log out of student account"
              className="px-4 py-1.5 rounded-[1600px] bg-[#ffffff] hover:bg-[#ffe5e5] text-[#fb4903] border border-[#000000] text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-none hover:border-[#fb4903] active:scale-95"
            >
              <LogOut className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Logout</span>
            </button>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#000000] leading-[0.90] font-['Space_Grotesk',sans-serif]">
            WELCOME BACK, <br />
            <span className="text-[#4da2ff] underline decoration-[#fb4903] underline-offset-8 uppercase">
              {studentDisplayName}
            </span>
          </h1>

          <p className="text-base font-medium text-[#000000] max-w-2xl leading-relaxed pt-2">
            Permanent Hostel Allocation:{' '}
            <span className="bg-[#ffd731] px-2.5 py-1 rounded-[8px] border border-[#000000] font-bold">
              {currentBlock} &bull; Room {currentRoom} (Floor {currentFloor})
            </span>
            . Access AI symptom checking, doctor consultations, emergency SOS, and hostel medicine delivery.
          </p>
        </div>

        {/* Location Sticker Card */}
        <div className="p-6 rounded-[20px] bg-[#e9ccff] border border-[#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[16px] bg-[#5c4ade] text-white border border-[#000000] flex items-center justify-center font-bold">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#000000]">Permanent Room Record</p>
              <h3 className="text-xl font-extrabold text-[#000000]">{currentBlock}, Room {currentRoom}</h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-2 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-xs font-extrabold shadow-none flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Hostel Allocation Saved</span>
            </span>
          </div>
        </div>
      </div>

      {/* Emergency SOS Banner (If Triggered) */}
      {sosActive && (
        <div className="p-6 rounded-[20px] bg-[#fb4903] text-white border border-[#000000] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-7 w-7 text-[#ffd731] shrink-0 stroke-[2.5]" />
            <div>
              <p className="font-extrabold text-base">EMERGENCY SOS DISPATCH TRIGGERED</p>
              <p className="text-xs font-bold text-white">Security Desk & Smart Ambulance assigned to {currentBlock} Room {currentRoom}. ETA: 3.5 min</p>
            </div>
          </div>
          <button
            onClick={() => setSosActive(false)}
            className="px-4 py-2 rounded-[1600px] bg-[#ffffff] text-[#000000] text-xs font-bold border border-[#000000] cursor-pointer"
          >
            Cancel Dispatch
          </button>
        </div>
      )}

      {/* Slush 3-Card Sticker Suite */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div
          onClick={() => navigate('/symptoms')}
          className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] hover:bg-[#55db9c]/20 transition-all cursor-pointer space-y-4 relative group"
        >
          <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000] text-[10px] font-bold">
            MIMIC-IV AI
          </span>
          <div className="h-12 w-12 rounded-[16px] bg-[#4da2ff] text-white border border-[#000000] flex items-center justify-center transform group-hover:scale-105 transition-transform">
            <Stethoscope className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h3 className="text-xl font-extrabold text-[#000000]">AI Symptom Checker</h3>
          <p className="text-xs font-medium text-[#000000] leading-relaxed">
            Evaluate symptoms with NLP extractions, Neural Net disease rankings, and XAI clinical summaries.
          </p>
          <div className="pt-2">
            <span className="px-4 py-2 rounded-[1600px] bg-[#000000] text-white text-xs font-bold border border-[#000000] inline-flex items-center gap-1.5">
              Run Assessment <ArrowRight className="h-3.5 w-3.5 text-[#ffd731]" />
            </span>
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => navigate('/appointments')}
          className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] hover:bg-[#e9ccff]/30 transition-all cursor-pointer space-y-4 relative group"
        >
          <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-[1600px] bg-[#e9ccff] text-[#000000] border border-[#000000] text-[10px] font-bold">
            CAMPUS DOCTORS
          </span>
          <div className="h-12 w-12 rounded-[16px] bg-[#5c4ade] text-white border border-[#000000] flex items-center justify-center transform group-hover:scale-105 transition-transform">
            <Calendar className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h3 className="text-xl font-extrabold text-[#000000]">Doctor Appointment</h3>
          <p className="text-xs font-medium text-[#000000] leading-relaxed">
            Book in-person clinic visits or video tele-consultations with Dr. Morepen Health Centre physicians.
          </p>
          <div className="pt-2">
            <span className="px-4 py-2 rounded-[1600px] bg-[#000000] text-white text-xs font-bold border border-[#000000] inline-flex items-center gap-1.5">
              Book Slot <ArrowRight className="h-3.5 w-3.5 text-[#ffd731]" />
            </span>
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => navigate('/student/records')}
          className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] hover:bg-[#ffd731]/30 transition-all cursor-pointer space-y-4 relative group"
        >
          <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-[1600px] bg-[#ffd731] text-[#000000] border border-[#000000] text-[10px] font-bold">
            EHR CERTIFICATES
          </span>
          <div className="h-12 w-12 rounded-[16px] bg-[#5c4ade] text-white border border-[#000000] flex items-center justify-center transform group-hover:scale-105 transition-transform">
            <FileText className="h-6 w-6 stroke-[2.5]" />
          </div>
          <h3 className="text-xl font-extrabold text-[#000000]">My Health Records</h3>
          <p className="text-xs font-medium text-[#000000] leading-relaxed">
            View medical history, laboratory reports, immunizations, and Dr. Morepen leave certificates.
          </p>
          <div className="pt-2">
            <span className="px-4 py-2 rounded-[1600px] bg-[#000000] text-white text-xs font-bold border border-[#000000] inline-flex items-center gap-1.5">
              View Records <ArrowRight className="h-3.5 w-3.5 text-[#ffd731]" />
            </span>
          </div>
        </div>
      </div>

      {/* Emergency SOS Direct Action Band */}
      <div className="p-8 rounded-[30px] bg-[#fb4903] text-white border border-[#000000] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[1600px] bg-[#ffd731] text-[#000000] text-xs font-black border border-[#000000]">
            <Zap className="h-3.5 w-3.5 text-[#000000]" />
            CRITICAL HEALTH EMERGENCY
          </div>
          <h2 className="text-3xl font-extrabold font-['Space_Grotesk',sans-serif]">24/7 Campus Emergency SOS</h2>
          <p className="text-xs font-bold text-white max-w-xl">
            Immediately alerts Security Gate Desk, Dr. Morepen Clinic Doctor, and dispatches Smart Ambulance to {currentBlock} Room {currentRoom}.
          </p>
        </div>

        <button
          onClick={() => navigate('/emergency')}
          className="px-8 py-4 rounded-[1600px] bg-[#ffffff] text-[#fb4903] font-black text-sm border-2 border-[#000000] hover:bg-slate-100 transition-colors cursor-pointer shadow-none flex items-center gap-2 shrink-0"
        >
          <ShieldAlert className="h-5 w-5 text-[#fb4903]" />
          <span>TRIGGER EMERGENCY SOS</span>
        </button>
      </div>
    </div>
  );
};
