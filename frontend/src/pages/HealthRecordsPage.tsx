import React, { useState } from 'react';
import { useAuth, getStudentMedicalAttributes } from '../context/AuthContext';
import {
  FileText,
  User,
  ShieldCheck,
  Stethoscope,
  Pill,
  AlertCircle,
  CheckCircle2,
  Droplet,
  Printer,
  X
} from 'lucide-react';

interface ConsultationRecord {
  id: string;
  date: string;
  doctorName: string;
  specialization: string;
  medicalRegNo: string;
  diagnosis: string;
  icdCode: string;
  symptoms: string;
  prescription: string[];
  medicalLeaveGranted: boolean;
  leaveDays?: number;
  leaveStartDate?: string;
  leaveEndDate?: string;
  fitDate?: string;
  notes?: string;
}

const MOCK_RECORDS: ConsultationRecord[] = [
  {
    id: 'MED-2026-9082',
    date: '2026-09-14',
    doctorName: 'Dr. Arun Kumar, M.B.B.S.',
    specialization: 'General Medicine & Campus Health Officer',
    medicalRegNo: 'SMC-MP-51204/MBBS',
    diagnosis: 'Acute Viral Pyrexia & Upper Respiratory Inflammation',
    icdCode: 'ICD-10: J06.9',
    symptoms: 'High grade fever (102°F), dry throat, chills, malaise, body ache',
    prescription: ['Paracetamol 650mg (1-1-1 after food)', 'Azithromycin 500mg (1-0-0 for 3 days)', 'Vitamin C 500mg (1-0-1)'],
    medicalLeaveGranted: true,
    leaveDays: 3,
    leaveStartDate: '14-09-2026',
    leaveEndDate: '17-09-2026',
    fitDate: '18-09-2026',
    notes: 'Advised strict bed rest in hostel room. Maintain adequate hydration. Review if fever persists past 48 hours.',
  },
  {
    id: 'MED-2026-7412',
    date: '2026-08-20',
    doctorName: 'Dr. Ananya Roy, M.D.',
    specialization: 'Dermatology & Student Health Specialist',
    medicalRegNo: 'SMC-MP-63910/DERM',
    diagnosis: 'Seasonal Allergic Contact Dermatitis',
    icdCode: 'ICD-10: L23.9',
    symptoms: 'Mild skin redness and localized itching on forearm',
    prescription: ['Cetirizine 10mg (0-0-1 at night)', 'Calamine Lotion (Apply twice daily)'],
    medicalLeaveGranted: false,
    notes: 'Avoid exposure to synthetic dust. Symptoms expected to clear in 3-4 days.',
  },
  {
    id: 'MED-2026-5109',
    date: '2026-05-10',
    doctorName: 'Dr. Arun Kumar, M.B.B.S.',
    specialization: 'General Medicine & Sports Fitness Physician',
    medicalRegNo: 'SMC-MP-51204/MBBS',
    diagnosis: 'Routine Annual Physical & Fitness Assessment',
    icdCode: 'ICD-10: Z00.0',
    symptoms: 'General fitness evaluation for university sports participation',
    prescription: ['Multivitamin Supplement (1 daily)'],
    medicalLeaveGranted: false,
    notes: 'Vitals normal. Fit for university sports participation.',
  },
];

export const HealthRecordsPage: React.FC = () => {
  const { user } = useAuth();
  const [records] = useState<ConsultationRecord[]>(MOCK_RECORDS);
  const [selectedRecord, setSelectedRecord] = useState<ConsultationRecord | null>(records[0]);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState<boolean>(false);
  const [downloadSuccess] = useState<string>('');

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
  const currentHostelDisplay = `${currentBlock} • Room ${currentRoom}`;

  const medicalAttrs = getStudentMedicalAttributes(user?.email || '');
  const currentBloodGroup = user?.studentProfile?.bloodGroup || medicalAttrs.bloodGroup;
  const currentAllergies = user?.studentProfile?.knownAllergies || medicalAttrs.knownAllergies;
  const currentRegNo =
    user?.registrationNumber ||
    user?.studentProfile?.registrationNo ||
    medicalAttrs.registrationNo;
  const currentStudentName =
    user?.fullName ||
    user?.name ||
    (currentRegNo ? `Student ${currentRegNo}` : 'Student User');

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleOpenCertificate = (rec: ConsultationRecord) => {
    setSelectedRecord(rec);
    setIsCertificateModalOpen(true);
  };

  return (
    <div className="space-y-8 text-[#000000]">
      {/* Top Banner Header */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#e9ccff] text-[#000000] border border-[#000000]">
              OFFICIAL ELECTRONIC HEALTH RECORD (EHR)
            </span>
            <span className="text-xs text-[#000000] font-bold uppercase tracking-wider">VIT Bhopal & Dr. Morepen Medical Registry</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#000000] tracking-tight font-['Space_Grotesk']">Student Health & Consultation Records</h2>
          <p className="text-xs text-[#000000] max-w-2xl font-medium">
            Access your complete campus medical history, clinical diagnosis reports, digital prescriptions, lab vitals history, and official Dr. Morepen medical leave certificates.
          </p>
        </div>

        <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] text-xs space-y-1 shrink-0 text-right">
          <div className="flex items-center justify-end gap-1.5 text-[#000000] font-extrabold">
            <ShieldCheck className="h-4 w-4" />
            <span>Encrypted Health Registry</span>
          </div>
          <p className="text-[#000000] font-extrabold uppercase">Student ID: {currentRegNo}</p>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-[20px] bg-[#55db9c] border border-[#000000] text-[#000000] text-xs flex items-center gap-2 shadow-none font-bold">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Student Personal Health Identity Card */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] shadow-none space-y-4">
        <div className="flex items-center justify-between border-b border-[#000000] pb-3">
          <h3 className="text-sm font-extrabold text-[#000000] uppercase tracking-wider flex items-center gap-2">
            <User className="h-4 w-4 text-[#fb4903] stroke-[2.5]" />
            Student Medical Profile Card
          </h3>
          <span className="text-xs font-bold text-[#000000] bg-[#e9ccff] px-3 py-1 rounded-[1600px] border border-[#000000]">
            Reg No: {currentRegNo}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-1">
            <span className="text-[#000000] block text-[10px] uppercase font-extrabold tracking-wider">FULL NAME</span>
            <span className="font-extrabold text-[#000000] text-sm uppercase">{currentStudentName}</span>
          </div>

          <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-1">
            <span className="text-[#000000] block text-[10px] uppercase font-extrabold tracking-wider">BLOOD GROUP</span>
            <span className="font-extrabold text-[#fb4903] text-sm flex items-center gap-1">
              <Droplet className="h-3.5 w-3.5" /> {currentBloodGroup}
            </span>
          </div>

          <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-1">
            <span className="text-[#000000] block text-[10px] uppercase font-extrabold tracking-wider">HOSTEL ALLOCATION</span>
            <span className="font-bold text-[#000000] text-xs">{currentHostelDisplay}</span>
          </div>

          <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-1">
            <span className="text-[#000000] block text-[10px] uppercase font-extrabold tracking-wider">KNOWN ALLERGIES</span>
            <span className="font-bold text-[#5c4ade] text-xs">{currentAllergies}</span>
          </div>
        </div>
      </div>

      {/* Main Records Layout: Left List + Right Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Timeline of Consultations */}
        <div className="lg:col-span-1 p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <div className="flex items-center justify-between border-b border-[#000000] pb-3">
            <h3 className="text-sm font-extrabold text-[#000000] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#5c4ade] stroke-[2.5]" />
              Medical History Log
            </h3>
            <span className="text-xs font-bold text-[#000000] bg-[#dceeff] px-3 py-1 rounded-[1600px] border border-[#000000]">{records.length} Records</span>
          </div>

          <div className="space-y-3">
            {records.map((rec) => {
              const isSelected = selectedRecord?.id === rec.id;
              return (
                <div
                  key={rec.id}
                  onClick={() => setSelectedRecord(rec)}
                  className={`p-4 rounded-[20px] border border-[#000000] transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#000000] text-white'
                      : 'bg-[#dceeff] text-[#000000] hover:bg-[#ffd731]/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs uppercase">{rec.id}</span>
                    <span className="text-[10px] font-bold opacity-90">{rec.date}</span>
                  </div>

                  <p className="font-extrabold text-xs leading-tight">{rec.diagnosis}</p>
                  <p className="text-[11px] font-bold opacity-80">{rec.doctorName}</p>

                  {rec.medicalLeaveGranted && (
                    <span className="inline-block text-[9px] font-bold px-2.5 py-0.5 rounded-[1600px] border border-[#000000] bg-[#55db9c] text-[#000000]">
                      Medical Leave ({rec.leaveDays} Days)
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Consultation Record & Medical Certificate */}
        <div className="lg:col-span-2 p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 shadow-none">
          {selectedRecord ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#000000] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#000000] font-extrabold uppercase">{selectedRecord.id}</span>
                    <span className="text-xs text-[#000000] font-bold">&bull;</span>
                    <span className="text-xs text-[#000000] font-bold">{selectedRecord.date}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[#000000] mt-1">{selectedRecord.diagnosis}</h3>
                </div>

                <button
                  onClick={() => handleOpenCertificate(selectedRecord)}
                  className="px-6 py-3 rounded-[1600px] bg-[#ffd731] hover:bg-[#ffd731]/90 text-[#000000] font-extrabold text-xs border border-[#000000] shadow-none transition-all flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <FileText className="h-4 w-4 text-[#000000]" />
                  <span>View Official Medical Certificate</span>
                </button>
              </div>

              {/* Physician Info */}
              <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-[1600px] bg-[#e9ccff] border border-[#000000] flex items-center justify-center text-[#000000] shrink-0 font-bold">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-extrabold text-[#000000] text-sm">{selectedRecord.doctorName}</p>
                    <p className="text-xs text-[#000000] font-bold">{selectedRecord.specialization}</p>
                    <p className="text-[10px] text-[#000000] font-extrabold uppercase">Reg No: {selectedRecord.medicalRegNo}</p>
                  </div>
                </div>

                {selectedRecord.medicalLeaveGranted && (
                  <div className="text-right">
                    <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#55db9c] text-[#000000] border border-[#000000]">
                      Medical Leave Granted ({selectedRecord.leaveDays} Days)
                    </span>
                  </div>
                )}
              </div>

              {/* Disease Reason & Diagnosis Box */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-[#000000] uppercase tracking-wider">Disease Diagnosis & Clinical Classification</h4>
                <div className="p-4 rounded-[20px] bg-[#ffffff] border border-[#000000] space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-[#000000]">{selectedRecord.diagnosis}</span>
                    <span className="font-bold text-[10px] bg-[#e9ccff] text-[#000000] px-2.5 py-0.5 rounded-[1600px] border border-[#000000]">
                      {selectedRecord.icdCode}
                    </span>
                  </div>
                  <p className="text-[#000000] text-[11px] font-bold">Symptom Presentation: {selectedRecord.symptoms}</p>
                </div>
              </div>

              {/* Prescribed Medications */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-[#000000] uppercase tracking-wider">Digital Prescriptions</h4>
                <div className="space-y-2">
                  {selectedRecord.prescription.map((med, i) => (
                    <div key={i} className="p-3.5 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-xs text-[#000000] font-extrabold flex items-center gap-2">
                      <Pill className="h-4 w-4 text-[#5c4ade]" />
                      <span>{med}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Physician Notes */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-[#000000] uppercase tracking-wider">Physician Instructions & Clinical Notes</h4>
                <div className="p-4 rounded-[20px] bg-[#ffffff] border border-[#000000] text-xs text-[#000000] italic leading-relaxed font-bold">
                  "{selectedRecord.notes}"
                </div>
              </div>

              {/* Embedded Certificate Preview Card */}
              <div className="p-6 rounded-[30px] bg-[#ffffff] text-[#000000] border-2 border-[#000000] shadow-none space-y-6">
                {/* Header Logo */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#000000] pb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src="/dr_morepen_logo.png" 
                      alt="Dr. Morepen Logo" 
                      className="h-14 object-contain"
                    />
                    <div>
                      <h4 className="text-lg font-extrabold text-[#000000] leading-tight tracking-tight">DR. MOREPEN HEALTHCARE</h4>
                      <p className="text-[11px] font-bold text-[#000000]">VIT Campus Health & Wellness Centre, Bhopal</p>
                    </div>
                  </div>

                  <div className="text-right text-xs text-[#000000] font-bold">
                    <p className="font-extrabold text-[#000000]">REF NO: {selectedRecord.id}</p>
                    <p className="font-bold">Date: {selectedRecord.date}</p>
                  </div>
                </div>

                {/* Certificate Title */}
                <div className="text-center space-y-1">
                  <h3 className="text-xl font-extrabold text-[#000000] uppercase tracking-wider underline underline-offset-4 decoration-[#fb4903]">
                    OFFICIAL MEDICAL FITNESS & LEAVE CERTIFICATE
                  </h3>
                  <p className="text-xs font-bold text-[#000000] uppercase tracking-widest">Issued under Campus Health & Safety Regulations</p>
                </div>

                {/* Formal Wording */}
                <div className="space-y-4 text-xs leading-relaxed text-[#000000] px-2 font-bold">
                  <p className="text-sm">
                    <strong>TO WHOMSOEVER IT MAY CONCERN</strong>
                  </p>

                  <p>
                    This is to certify that Mr. <strong className="text-[#000000] text-sm font-extrabold underline decoration-[#4da2ff]">{currentStudentName}</strong>, 
                    Registration No: <strong className="text-[#000000] font-extrabold">{currentRegNo}</strong>, 
                    resident student of <strong>{currentHostelDisplay}</strong>, was examined under my direct clinical supervision at the 
                    Dr. Morepen - VIT Campus Health Centre on <strong>{selectedRecord.date}</strong>.
                  </p>

                  {/* Disease Reason Section */}
                  <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] space-y-1">
                    <p className="font-extrabold text-[#000000] text-xs uppercase tracking-wider">
                      1. Disease Diagnosis & Reason for Medical Leave:
                    </p>
                    <p className="text-[#000000] text-xs font-bold">
                      The patient was diagnosed with <strong className="text-[#000000] font-extrabold">{selectedRecord.diagnosis}</strong> ({selectedRecord.icdCode}), presenting acute symptoms including <em>{selectedRecord.symptoms}</em>.
                    </p>
                  </div>

                  {/* Medical Advice Wording */}
                  <div className="p-4 rounded-[20px] bg-[#e9ccff] border border-[#000000] space-y-1">
                    <p className="font-extrabold text-[#000000] text-xs uppercase tracking-wider">
                      2. Recommended Medical Rest & Fitness Declaration:
                    </p>
                    {selectedRecord.medicalLeaveGranted ? (
                      <p className="text-[#000000] text-xs font-bold">
                        On clinical grounds, the patient was advised strict room rest for a period of <strong>{selectedRecord.leaveDays} Days</strong> (from <strong>{selectedRecord.leaveStartDate || selectedRecord.date}</strong> to <strong>{selectedRecord.leaveEndDate || selectedRecord.date}</strong>). 
                        The student is declared <strong>Medically Fit</strong> to resume regular academic lectures, practical laboratory sessions, and campus activities with effect from <strong>{selectedRecord.fitDate || '18-09-2026'}</strong>.
                      </p>
                    ) : (
                      <p className="text-[#000000] text-xs font-bold">
                        The patient underwent general medical evaluation and is declared <strong>Medically Fit</strong> for all university academic and extra-curricular activities.
                      </p>
                    )}
                  </div>
                </div>

                {/* Doctor Signature & Stamp Section */}
                <div className="pt-6 border-t border-[#000000] flex flex-col sm:flex-row items-end justify-between gap-6">
                  {/* Verification Seal Badge */}
                  <div className="p-3.5 rounded-[20px] bg-[#55db9c] border border-[#000000] flex items-center gap-3 text-xs text-[#000000] font-bold">
                    <ShieldCheck className="h-7 w-7 text-[#000000] shrink-0" />
                    <div>
                      <p className="font-extrabold">Dr. Morepen Official Seal</p>
                      <p className="text-[10px] font-bold">Digitally Verified & Encrypted</p>
                    </div>
                  </div>

                  {/* Doctor Signature Block */}
                  <div className="text-right space-y-1 min-w-[200px]">
                    <div className="h-10 flex items-center justify-end">
                      <span className="font-serif italic text-lg font-bold text-[#000000] underline decoration-[#5c4ade]">
                        {selectedRecord.doctorName}
                      </span>
                    </div>
                    <p className="font-extrabold text-[#000000] text-xs">{selectedRecord.doctorName}</p>
                    <p className="text-[11px] text-[#000000] font-bold">{selectedRecord.specialization}</p>
                    <p className="text-[10px] text-[#000000] font-extrabold">Reg No: {selectedRecord.medicalRegNo}</p>
                    <p className="text-[9px] text-[#000000] font-extrabold uppercase pt-1">[ Signed & Digitally Verified ]</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#000000] text-xs font-bold">
              Select a medical record from the left history log to view detailed diagnosis reports.
            </div>
          )}
        </div>
      </div>

      {/* Full-Screen Printable Certificate Modal */}
      {isCertificateModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#ffffff] text-[#000000] w-full max-w-3xl rounded-[30px] p-8 space-y-6 shadow-none relative border-2 border-[#000000]">
            {/* Modal Close Button */}
            <button
              onClick={() => setIsCertificateModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-[1600px] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] border border-[#000000] transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Dr. Morepen Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#000000] pb-4">
              <div className="flex items-center gap-4">
                <img 
                  src="/dr_morepen_logo.png" 
                  alt="Dr. Morepen Logo" 
                  className="h-16 object-contain"
                />
                <div>
                  <h3 className="text-2xl font-extrabold text-[#000000] tracking-tight">DR. MOREPEN HEALTHCARE</h3>
                  <p className="text-xs font-bold text-[#000000]">VIT Campus Health Centre & Wellness Registry, Bhopal</p>
                  <p className="text-[10px] text-[#000000] font-bold">Contact: +91 755 284 0000 | Email: health@vitbhopal.ac.in</p>
                </div>
              </div>

              <div className="text-right font-extrabold text-xs text-[#000000]">
                <p className="font-extrabold text-[#000000]">CERTIFICATE NO: {selectedRecord.id}</p>
                <p>Date of Issue: {selectedRecord.date}</p>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-extrabold text-[#000000] uppercase tracking-widest underline underline-offset-8 decoration-[#fb4903]">
                MEDICAL FITNESS & LEAVE CERTIFICATE
              </h2>
              <p className="text-xs font-bold text-[#000000] uppercase tracking-widest pt-1">Issued for University Attendance & Examination Exemption</p>
            </div>

            {/* Formal Medical Wording */}
            <div className="space-y-5 text-xs text-[#000000] leading-relaxed px-2 font-bold">
              <p className="text-sm font-extrabold text-[#000000] uppercase">
                TO WHOMSOEVER IT MAY CONCERN
              </p>

              <p className="text-sm">
                This is to certify that Student <strong className="text-[#000000] font-extrabold text-base underline decoration-[#4da2ff]">{currentStudentName}</strong>, 
                bearing Registration Number <strong className="text-[#000000] font-extrabold text-sm">{currentRegNo}</strong>, 
                enrolled in the <strong>Computer Science & Engineering Department</strong> at Vellore Institute of Technology, and currently residing at <strong>{currentHostelDisplay}</strong>, 
                was presented and examined at Dr. Morepen Health Centre on <strong>{selectedRecord.date}</strong>.
              </p>

              {/* Disease Diagnosis & Reason */}
              <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] space-y-1.5">
                <h4 className="font-extrabold text-[#000000] text-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <AlertCircle className="h-4 w-4 text-[#fb4903]" />
                  Clinical Diagnosis & Disease Reason:
                </h4>
                <p className="text-[#000000] text-xs leading-normal font-bold">
                  The patient was diagnosed with <strong className="text-[#000000] font-extrabold text-sm">{selectedRecord.diagnosis}</strong> ({selectedRecord.icdCode}), presenting clinical symptoms including <em>{selectedRecord.symptoms}</em>.
                </p>
              </div>

              {/* Medical Leave Recommendation */}
              <div className="p-4 rounded-[20px] bg-[#e9ccff] border border-[#000000] space-y-1.5">
                <h4 className="font-extrabold text-[#000000] text-sm flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 text-[#5c4ade]" />
                  Medical Leave Granted & Fitness Declaration:
                </h4>
                {selectedRecord.medicalLeaveGranted ? (
                  <p className="text-[#000000] text-xs leading-normal font-bold">
                    Under strict medical advice, the student was granted medical leave for <strong>{selectedRecord.leaveDays} Days</strong> from <strong>{selectedRecord.leaveStartDate || selectedRecord.date}</strong> to <strong>{selectedRecord.leaveEndDate || selectedRecord.date}</strong>. 
                    Following clinical re-assessment, the student is hereby declared <strong>MEDICALLY FIT</strong> to resume all university lectures, practical laboratory sessions, exams, and hostel residency with effect from <strong>{selectedRecord.fitDate || '18-09-2026'}</strong>.
                  </p>
                ) : (
                  <p className="text-[#000000] text-xs leading-normal font-bold">
                    The student has undergone thorough clinical assessment and is declared <strong>MEDICALLY FIT</strong> for all academic and extra-curricular university duties.
                  </p>
                )}
              </div>
            </div>

            {/* Doctor Signature & Stamp Footer */}
            <div className="pt-8 border-t border-[#000000] flex items-end justify-between gap-6">
              {/* Dr. Morepen Official Stamp Badge */}
              <div className="p-4 rounded-[20px] bg-[#55db9c] border border-[#000000] flex items-center gap-3 text-xs text-[#000000]">
                <ShieldCheck className="h-9 w-9 text-[#000000] shrink-0" />
                <div>
                  <p className="font-extrabold text-sm">Dr. Morepen Verified Seal</p>
                  <p className="text-[#000000] font-bold text-[11px]">Official Campus Health Stamp</p>
                  <p className="text-[10px] text-[#000000] font-extrabold">Digital Signature ID: VER-9082-VIT</p>
                </div>
              </div>

              {/* Signature Block */}
              <div className="text-right space-y-1">
                <div className="h-12 flex items-center justify-end">
                  <span className="font-serif italic text-2xl font-extrabold text-[#000000] underline decoration-[#5c4ade]">
                    {selectedRecord.doctorName}
                  </span>
                </div>
                <p className="font-extrabold text-[#000000] text-sm">{selectedRecord.doctorName}</p>
                <p className="text-xs text-[#000000] font-bold">{selectedRecord.specialization}</p>
                <p className="text-xs text-[#000000] font-bold">State Medical Council Reg: {selectedRecord.medicalRegNo}</p>
                <span className="inline-block mt-1 px-3 py-0.5 rounded-[1600px] text-[10px] font-extrabold bg-[#000000] text-white border border-[#000000]">
                  OFFICIALLY SIGNED & STAMPED
                </span>
              </div>
            </div>

            {/* Print & Action Buttons */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#000000]">
              <button
                onClick={() => setIsCertificateModalOpen(false)}
                className="px-6 py-3 rounded-[1600px] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] border border-[#000000] font-bold text-xs transition-colors cursor-pointer"
              >
                Close Window
              </button>

              <button
                onClick={handlePrintCertificate}
                className="px-6 py-3 rounded-[1600px] bg-[#000000] text-white hover:bg-[#333333] font-bold text-xs border border-[#000000] shadow-none flex items-center gap-2 transition-all cursor-pointer uppercase tracking-wider"
              >
                <Printer className="h-4 w-4 text-[#ffd731]" />
                <span>Print / Save PDF Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
