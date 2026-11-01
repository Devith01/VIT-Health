import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { createEmergencyApi, getActiveEmergenciesApi, EmergencyCase } from '../api/emergency.api';
import { LiveAmbulanceMap } from '../components/LiveAmbulanceMap';
import { Truck, ShieldAlert, Navigation, Activity } from 'lucide-react';

export const EmergencyPage: React.FC = () => {
  const { user } = useAuth();
  const roomInfo = user?.studentProfile?.room;
  const defaultEmergencyLoc = roomInfo ? `${roomInfo.floor?.block?.name || 'Boys Block 1'} - Room ${roomInfo.roomNum || '301'}` : 'Boys Block 1 - Room 301';

  const [, setEmergencies] = useState<EmergencyCase[]>([]);
  const [location, setLocation] = useState<string>(defaultEmergencyLoc);
  const [description, setDescription] = useState<string>('Student experiencing severe fever and loss of consciousness');
  const [isThirdParty, setIsThirdParty] = useState<boolean>(false);
  const [reporterName, setReporterName] = useState<string>('');
  const [studentRegNo, setStudentRegNo] = useState<string>('21BCE1001');

  useEffect(() => {
    if (roomInfo) {
      setLocation(`${roomInfo.floor?.block?.name || 'Boys Block 1'} - Room ${roomInfo.roomNum || '301'}`);
    }
  }, [user]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [, setErrorMsg] = useState<string>('');

  const [eta, setEta] = useState<number>(3.5);

  useEffect(() => {
    fetchActiveEmergencies();
  }, []);

  const fetchActiveEmergencies = async () => {
    try {
      const res = await getActiveEmergenciesApi();
      setEmergencies(res.data.emergencies);
    } catch (err) {
      setEmergencies([
        {
          id: 'emerg-demo-1',
          description: 'Severe fever & respiratory tightness',
          severity: 'CRITICAL',
          status: 'AMBULANCE_DISPATCHED',
          location: 'Block A - Floor 3 - Room 301',
          reportedBy: 'Aarav Patel (Self Report)',
          ambulance: { vehicleNumber: 'MP-04-VT-1001', driverName: 'Ramesh Kumar', driverPhone: '+91 9988776655' },
          etaMinutes: 3.5,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleReportEmergency = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setIsLoading(true);

    try {
      const res = await createEmergencyApi({
        location,
        description,
        severity: 'CRITICAL',
        isThirdPartyReport: isThirdParty,
        reporterName: isThirdParty ? reporterName : user?.fullName,
        studentRegistrationNo: studentRegNo,
      });

      setSuccessMsg('CRITICAL EMERGENCY DISPATCHED: Clinic, Ambulance MP-04-VT-1001 & Block Security notified immediately!');
      setEmergencies((prev) => [res.data.emergency, ...prev]);
      setEta(4.0);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || 'Emergency dispatch initiated');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto text-[#000000]">
      {/* Header Banner */}
      <div className="p-8 rounded-[30px] bg-[#fb4903] text-white border border-[#000000] shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-[1600px] text-xs font-extrabold bg-[#ffffff] text-[#000000] border border-[#000000] uppercase tracking-wider">
              SMART EMERGENCY DISPATCH
            </span>
            <span className="text-xs text-white font-bold uppercase tracking-wider">VIT Bhopal Campus Health Safety</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">Smart Emergency & Ambulance Dispatch</h2>
          <p className="text-xs text-white max-w-xl font-bold">
            Automatic nearest ambulance assignment, security room dispatch, third-party emergency reporting, and live Google Maps GPS tracking.
          </p>
        </div>

        <div className="p-4 rounded-[20px] bg-[#ffffff] text-[#000000] border border-[#000000] text-center shrink-0">
          <p className="text-3xl font-extrabold text-[#fb4903]">{eta} min</p>
          <p className="text-[10px] uppercase font-extrabold tracking-wider">Ambulance ETA</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-[20px] bg-[#55db9c] border border-[#000000] text-[#000000] text-xs flex items-center gap-3 shadow-none font-bold">
          <ShieldAlert className="h-6 w-6 shrink-0" />
          <span className="leading-relaxed">{successMsg}</span>
        </div>
      )}

      {/* Emergency Cascade & Live Tracking Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: 1-Click SOS / Report Form */}
        <div className="lg:col-span-1 p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-5 shadow-none h-fit">
          <div className="flex items-center justify-between border-b border-[#000000] pb-3">
            <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#fb4903] stroke-[2.5]" />
              Emergency SOS Form
            </h3>
            <span className="px-3 py-1 rounded-[1600px] bg-[#fb4903] text-white text-[10px] font-bold border border-[#000000]">PRIORITY 1</span>
          </div>

          <form onSubmit={handleReportEmergency} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-[20px] bg-[#dceeff] border border-[#000000] flex items-center gap-2 text-[#000000] font-bold">
              <input
                type="checkbox"
                id="thirdParty"
                checked={isThirdParty}
                onChange={(e) => setIsThirdParty(e.target.checked)}
                className="rounded accent-[#000000] cursor-pointer h-4 w-4"
              />
              <label htmlFor="thirdParty" className="cursor-pointer text-[11px] font-bold">
                Reporting for another student (roommate unconscious)
              </label>
            </div>

            {isThirdParty && (
              <div className="space-y-2">
                <div>
                  <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[10px]">Ill Student Reg No</label>
                  <input
                    type="text"
                    value={studentRegNo}
                    onChange={(e) => setStudentRegNo(e.target.value)}
                    className="w-full px-4 py-3 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] font-bold outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[10px]">Your Name (Reporter)</label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] font-bold outline-none"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[10px]">Location / Hostel Room</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-3 rounded-[1600px] bg-[#ffffff] border border-[#000000] text-[#000000] font-bold outline-none"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[10px]">Emergency Condition Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-4 rounded-[20px] bg-[#ffffff] border border-[#000000] text-[#000000] font-bold outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-[1600px] bg-[#000000] text-white hover:bg-[#333333] font-extrabold text-xs border border-[#000000] shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
            >
              <ShieldAlert className="h-4 w-4 text-[#fb4903]" />
              <span>DISPATCH EMERGENCY AMBULANCE</span>
            </button>
          </form>
        </div>

        {/* Right 2-Cols: Live Google Maps Ambulance Tracking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Google Maps Live Ambulance Tracking Component */}
          <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
            <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
              <Navigation className="h-5 w-5 text-[#4da2ff] stroke-[2.5]" />
              Google Maps Live Ambulance GPS Tracking
            </h3>

            <LiveAmbulanceMap
              vehicleNumber="MP-04-VT-1001"
              driverName="Ramesh Kumar"
              driverPhone="+91 9988776655"
              destinationHostel={location.toLowerCase().includes('girls') ? 'Girls Hostel 1' : 'Boys Hostel 1'}
              destinationText={location}
              isDispatched={successMsg.length > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
