import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDoctorsApi, bookAppointmentApi, getMyAppointmentsApi, cancelAppointmentApi, Doctor, Appointment } from '../api/appointment.api';
import {
  VTOP_TIME_SLOTS,
  VTOP_DAYS,
  getStudentTimetable,
  isClassConflict,
  findBestAutoSlot,
  StudentVtopTimetable,
} from '../config/vtopTimetables';
import {
  Calendar,
  Clock,
  Video,
  UserCheck,
  Stethoscope,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Grid,
  Check,
  AlertTriangle,
  Info,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Booking Form State
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [appointmentType, setAppointmentType] = useState<'IN_PERSON' | 'TELECONSULTATION'>('IN_PERSON');
  const [appointmentDate, setAppointmentDate] = useState<string>(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [appointmentTimeSlot, setAppointmentTimeSlot] = useState<string>('10:05');
  const [notes, setNotes] = useState<string>('');

  // VTOP Timetable View State
  const studentTimetable: StudentVtopTimetable = getStudentTimetable(user?.id);
  const [selectedDay, setSelectedDay] = useState<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'>('MON');
  const [aiRecommendation, setAiRecommendation] = useState<{ recommendedSlot: string; timeRange: string; reason: string } | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (appointmentDate) {
      const d = new Date(appointmentDate);
      const dayIndex = d.getDay();
      const daysMap: Array<'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'MON'> = ['MON', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      const currentDay = daysMap[dayIndex] || 'MON';
      setSelectedDay(currentDay);

      const best = findBestAutoSlot(user?.id, currentDay);
      setAiRecommendation(best);
    }
  }, [appointmentDate, user?.id]);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const docRes = await getDoctorsApi();
      setDoctors(docRes.data.doctors);
      if (docRes.data.doctors.length > 0) {
        setSelectedDoctorId(docRes.data.doctors[0].id);
      }

      const aptRes = await getMyAppointmentsApi();
      setAppointments(aptRes.data.appointments);
    } catch (err: any) {
      setErrorMsg('Failed to load doctor availabilities');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAiAutoSchedule = () => {
    const best = findBestAutoSlot(user?.id, selectedDay);
    setAppointmentTimeSlot(best.recommendedSlot);
    setAiRecommendation(best);
    setSuccessMsg(`🤖 AI Auto-Scheduled: Selected ${best.timeRange} (${selectedDay}) — VTOP verified free hour with 0 class conflicts!`);
  };

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!selectedDoctorId) {
      setErrorMsg('Please select a doctor');
      return;
    }

    const conflictCheck = isClassConflict(user?.id, selectedDay, appointmentTimeSlot);
    if (conflictCheck.hasConflict && conflictCheck.classInfo?.courseCode) {
      setErrorMsg(
        `❌ CLASS CONFLICT: You have ${conflictCheck.classInfo.courseCode} (${conflictCheck.classInfo.courseTitle}) in ${conflictCheck.classInfo.venue} at this time. Please select a FREE open slot!`
      );
      return;
    }

    const isoDateTime = new Date(`${appointmentDate}T${appointmentTimeSlot}:00`).toISOString();

    try {
      const res = await bookAppointmentApi({
        doctorId: selectedDoctorId,
        type: appointmentType,
        appointmentTime: isoDateTime,
        notes,
      });

      setSuccessMsg('Appointment scheduled successfully and synced with your VTOP schedule!');
      setAppointments((prev) => [res.data.appointment, ...prev]);
      setNotes('');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || 'Booking failed');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancelAppointmentApi(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: 'CANCELLED' } : a))
      );
    } catch (err: any) {
      setErrorMsg('Failed to cancel appointment');
    }
  };

  const conflictStatus = isClassConflict(user?.id, selectedDay, appointmentTimeSlot);
  const opdPhysician = doctors.find((doctor) =>
    /general|physician|opd/i.test(doctor.specialization)
  ) || doctors[0];
  const mentalCounselor = doctors.find((doctor) =>
    /mental|counsel|psych|wellness/i.test(doctor.specialization)
  ) || doctors[1] || opdPhysician;

  const providerOptions = [
    { id: opdPhysician?.id, label: 'Physician for OPD Issues' },
    { id: mentalCounselor?.id, label: 'Mental Counsellor' },
  ].filter((provider): provider is { id: string; label: string } => Boolean(provider.id));

  return (
    <div className="space-y-8 bg-[#dceeff] text-[#000000] font-sans">
      {/* Top Hero Banner - Slush Sticker Card */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-[1600px] text-xs font-bold bg-[#ffd731] text-[#000000] border border-[#000000]">
              VTOP SMART AUTO-SCHEDULER
            </span>
            <span className="text-xs font-bold text-[#000000]">Class Timetable Synced</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#000000] font-['Space_Grotesk']">VTOP Doctor Appointment Scheduler</h2>
          <p className="text-xs font-medium text-[#000000] max-w-2xl">
            AI automatically cross-references your <strong>official VTOP Class Timetable</strong> against Doctor OPD hours to book appointments during your <strong>FREE open hours</strong>.
          </p>
        </div>

        <button
          onClick={handleAiAutoSchedule}
          className="px-5 py-3 rounded-[1600px] bg-[#000000] text-white font-bold text-xs border border-[#000000] hover:bg-[#333333] flex items-center gap-2 shrink-0 cursor-pointer transition-transform hover:scale-105"
        >
          <Sparkles className="h-4 w-4 text-[#ffd731]" />
          <span>AI Auto-Select Best Slot</span>
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-[20px] bg-[#55db9c] border border-[#000000] text-[#000000] font-bold text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-[#000000] shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-[20px] bg-[#fb4903] text-white border border-[#000000] font-bold text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-[#ffd731] shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* VTOP Timetable Visual Matrix Component */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#000000] pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-[16px] bg-[#4da2ff] text-white border border-[#000000] flex items-center justify-center font-bold">
              <Grid className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#000000] font-['Space_Grotesk']">
                Official VTOP Student Class Timetable Matrix
              </h3>
              <p className="text-xs font-medium text-[#000000]">
                Registered Student: <strong>{studentTimetable.studentName} ({studentTimetable.registrationNo})</strong> — {studentTimetable.branch}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-[1600px] bg-[#55db9c] text-[#000000] border border-[#000000]">
              <span className="h-2 w-2 rounded-full bg-[#000000]"></span>
              <span>Green: VTOP Class (BUSY)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-[1600px] bg-[#e9ccff] text-[#000000] border border-[#000000]">
              <span className="h-2 w-2 rounded-full bg-[#000000]"></span>
              <span>Lavender: Free Slot (AI Recommended)</span>
            </div>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#dceeff] text-[#000000] border-b border-[#000000] text-[11px] font-bold">
                <th className="p-3 border-r border-[#000000] w-16 text-center">DAY</th>
                {VTOP_TIME_SLOTS.map((ts) => (
                  <th key={ts.range} className="p-3 border-r border-[#000000] text-center min-w-[120px]">
                    <div>{ts.range}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {VTOP_DAYS.map((day) => {
                const daySchedule = studentTimetable.weeklySchedule[day] || {};
                const isSelectedDay = selectedDay === day;

                return (
                  <tr
                    key={day}
                    className={`border-b border-[#000000] transition-colors ${
                      isSelectedDay ? 'bg-[#e9ccff]/50' : 'hover:bg-[#dceeff]/30'
                    }`}
                  >
                    <td className="p-3 font-extrabold text-center border-r border-[#000000] text-[#000000]">
                      {day}
                    </td>

                    {VTOP_TIME_SLOTS.map((ts) => {
                      const slot = daySchedule[ts.range];
                      const isClass = slot && slot.isRegistered;
                      const isSelectedSlot = isSelectedDay && appointmentTimeSlot === ts.timeVal;

                      return (
                        <td
                          key={ts.range}
                          onClick={() => {
                            setSelectedDay(day);
                            setAppointmentTimeSlot(ts.timeVal);
                          }}
                          className={`p-2 border-r border-[#000000] text-center transition-all cursor-pointer ${
                            isClass
                              ? 'bg-[#55db9c] text-[#000000] font-bold'
                              : isSelectedSlot
                              ? 'bg-[#000000] text-[#ffffff] font-extrabold'
                              : 'bg-[#ffffff] text-[#000000] hover:bg-[#ffd731]/40'
                          }`}
                        >
                          {isClass ? (
                            <div className="space-y-0.5">
                              <span className={`font-extrabold text-[10px] block ${isSelectedSlot ? 'text-[#ffd731]' : 'text-[#000000]'}`}>
                                {slot.slotCode}-{slot.courseCode}
                              </span>
                              <span className={`text-[9px] block truncate max-w-[110px] mx-auto font-medium ${isSelectedSlot ? 'text-white' : 'text-[#000000]'}`}>
                                {slot.venue}
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-0.5 py-1">
                              <span className={`text-[10px] font-bold block ${isSelectedSlot ? 'text-[#ffd731]' : 'text-[#000000]'}`}>
                                {slot ? slot.slotCode : 'FREE'}
                              </span>
                              <span className={`text-[9px] block font-medium ${isSelectedSlot ? 'text-white' : 'text-[#000000]'}`}>
                                Open Slot
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {aiRecommendation && (
          <div className="p-4 rounded-[20px] bg-[#e9ccff] border border-[#000000] flex items-center justify-between text-xs text-[#000000] font-bold">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#fb4903] shrink-0" />
              <span>{aiRecommendation.reason}</span>
            </div>
            <span className="font-mono text-[#000000] font-extrabold bg-[#ffd731] px-3 py-1 rounded-[1600px] border border-[#000000]">
              Selected Slot: {aiRecommendation.timeRange}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 1-Col: Booking Form */}
        <div className="lg:col-span-1 p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6 h-fit">
          <div className="flex items-center justify-between border-b border-[#000000] pb-3">
            <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#4da2ff]" />
              Book Doctor Slot
            </h3>
            <span className="px-2 py-0.5 rounded-[1600px] bg-[#ffd731] border border-[#000000] text-[10px] font-bold">
              VTOP Check
            </span>
          </div>

          <form onSubmit={handleBook} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#000000] mb-1">Select Physician</label>
              <select
                value={selectedDoctorId}
                onChange={(e) => setSelectedDoctorId(e.target.value)}
                className="w-full px-3 py-3 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-xs text-[#000000] font-bold outline-none cursor-pointer"
              >
                {providerOptions.map((provider) => (
                  <option key={provider.label} value={provider.id} className="bg-[#ffffff] text-[#000000]">
                    {provider.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#000000] mb-1">Consultation Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAppointmentType('IN_PERSON')}
                  className={`py-2.5 rounded-[1600px] text-xs font-bold transition-all border border-[#000000] flex items-center justify-center gap-1.5 cursor-pointer ${
                    appointmentType === 'IN_PERSON'
                      ? 'bg-[#000000] text-white'
                      : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  In-Person
                </button>

                <button
                  type="button"
                  onClick={() => setAppointmentType('TELECONSULTATION')}
                  className={`py-2.5 rounded-[1600px] text-xs font-bold transition-all border border-[#000000] flex items-center justify-center gap-1.5 cursor-pointer ${
                    appointmentType === 'TELECONSULTATION'
                      ? 'bg-[#000000] text-white'
                      : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                  }`}
                >
                  <Video className="h-3.5 w-3.5" />
                  Teleconsult
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#000000] mb-1">Date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-xs text-[#000000] font-bold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#000000] mb-1">Time Slot</label>
                <select
                  value={appointmentTimeSlot}
                  onChange={(e) => setAppointmentTimeSlot(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-xs text-[#000000] font-bold outline-none"
                >
                  <option value="10:05">10:05 AM (Slot 2)</option>
                  <option value="11:40">11:40 AM (Slot 3)</option>
                  <option value="13:15">01:15 PM (Slot 4)</option>
                  <option value="14:50">02:50 PM (Slot 5)</option>
                  <option value="16:25">04:25 PM (Slot 6)</option>
                  <option value="18:00">06:00 PM (Slot 7)</option>
                </select>
              </div>
            </div>

            {/* Live Class Conflict Status Badge */}
            <div className="p-3 rounded-[16px] border border-[#000000] text-xs">
              {conflictStatus.hasConflict ? (
                <div className="text-[#000000] bg-[#fb4903] border border-[#000000] p-3 rounded-[12px] flex items-start gap-2 text-white">
                  <AlertTriangle className="h-4 w-4 text-[#ffd731] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-extrabold text-white">Class Conflict Detected!</strong>
                    <span>You have {conflictStatus.classInfo?.courseCode} in {conflictStatus.classInfo?.venue} at this time.</span>
                  </div>
                </div>
              ) : (
                <div className="text-[#000000] bg-[#55db9c] border border-[#000000] p-3 rounded-[12px] flex items-center gap-2 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-[#000000] shrink-0" />
                  <span><strong>No Class Conflict!</strong> VTOP verified open slot.</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#000000] mb-1">Reason / Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your health problem..."
                className="w-full p-3 rounded-[16px] bg-[#ffffff] border border-[#000000] text-xs text-[#000000] font-medium outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || conflictStatus.hasConflict}
              className="w-full py-3.5 rounded-[1600px] bg-[#000000] text-white font-extrabold text-xs border border-[#000000] hover:bg-[#333333] transition-all disabled:opacity-50 cursor-pointer"
            >
              {conflictStatus.hasConflict ? 'Select Open Slot to Book' : 'Confirm VTOP-Verified Booking'}
            </button>
          </form>
        </div>

        {/* Right 2-Cols: Scheduled Appointments */}
        <div className="lg:col-span-2 p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-6">
          <div className="flex items-center justify-between border-b border-[#000000] pb-3">
            <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
              <Clock className="h-5 w-5 text-[#55db9c]" />
              Scheduled Doctor Appointments
            </h3>
            <span className="px-3 py-1 rounded-[1600px] bg-[#dceeff] text-[#000000] border border-[#000000] text-xs font-bold">
              {appointments.length} Total
            </span>
          </div>

          <div className="space-y-4">
            {appointments.length === 0 ? (
              <div className="p-8 text-center text-[#000000] font-bold text-xs bg-[#dceeff] rounded-[20px] border border-[#000000]">
                No active appointments found.
              </div>
            ) : (
              appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-[#000000] text-base">
                        {apt.doctor?.user?.fullName || 'Dr. Vikramaditya Sen'}
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-[1600px] bg-[#e9ccff] text-[#000000] border border-[#000000] font-bold">
                        {apt.doctor?.specialization || 'General Medicine'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-[1600px] border border-[#000000] ${
                          apt.type === 'TELECONSULTATION'
                            ? 'bg-[#5c4ade] text-white'
                            : 'bg-[#4da2ff] text-white'
                        }`}
                      >
                        {apt.type}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-[1600px] border border-[#000000] ${
                          apt.status === 'CONFIRMED'
                            ? 'bg-[#55db9c] text-[#000000]'
                            : apt.status === 'CANCELLED'
                            ? 'bg-[#fb4903] text-white'
                            : 'bg-[#ffd731] text-[#000000]'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-[#000000]">
                      Scheduled for: <strong className="text-[#000000]">{new Date(apt.appointmentTime).toLocaleString()}</strong>
                    </p>

                    {apt.notes && <p className="text-xs text-[#000000] italic font-medium">"{apt.notes}"</p>}

                    {apt.meetingLink && apt.status !== 'CANCELLED' && (
                      <div className="pt-1 flex items-center gap-2">
                        <a
                          href={apt.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[1600px] bg-[#5c4ade] text-white font-bold text-xs border border-[#000000]"
                        >
                          <Video className="h-3.5 w-3.5" />
                          Join Jitsi Teleconsultation Room
                          <ExternalLink className="h-3 w-3 ml-0.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  {apt.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleCancel(apt.id)}
                      className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#000000] rounded-[1600px] border border-[#000000] hover:bg-[#fb4903] transition-colors cursor-pointer"
                    >
                      Cancel Slot
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
