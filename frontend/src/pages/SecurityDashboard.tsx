import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getActiveEmergenciesApi, EmergencyCase } from '../api/emergency.api';
import { LiveAmbulanceMap } from '../components/LiveAmbulanceMap';
import { ShieldAlert, MapPin, Clock, Truck, FileText } from 'lucide-react';

export const SecurityDashboard: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const [emergencies, setEmergencies] = useState<EmergencyCase[]>([]);
  const [activeStep, setActiveStep] = useState<string>('ASSIGNED');

  useEffect(() => {
    getActiveEmergenciesApi()
      .then((res) => setEmergencies(res.data.emergencies))
      .catch(() => {
        setEmergencies([
          {
            id: 'emerg-sec-101',
            description: 'High priority student emergency assistance required',
            severity: 'CRITICAL',
            status: 'SECURITY_CHECKING',
            location: 'Block A - Floor 3 - Room 301',
            reportedBy: 'Aarav Patel (Roommate Report)',
            ambulance: { vehicleNumber: 'MP-04-VT-1001', driverName: 'Ramesh Kumar', driverPhone: '+91 9988776655' },
            etaMinutes: 4.0,
            createdAt: new Date().toISOString(),
          },
        ]);
      });
  }, []);

  return (
    <div className="space-y-6 text-[#000000]">
      {/* Header Banner */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#ffd731] text-[#000000] border border-[#000000]">
              CAMPUS SECURITY EMERGENCY DESK
            </span>
            <span className="text-xs text-[#000000] font-bold uppercase tracking-wider">Block A Main Gate Security Desk</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">Active Emergency Dispatch & Room Assistance</h2>
          <p className="text-xs text-[#000000] max-w-xl font-medium">
            Receive immediate student room assistance alerts, verify location safety, coordinate with Smart Ambulance units, and update room assistance status.
          </p>
        </div>

        <div className="p-4 rounded-[20px] bg-[#fb4903] text-white border border-[#000000] text-center shrink-0">
          <p className="text-3xl font-extrabold">{emergencies.length}</p>
          <p className="text-[10px] uppercase font-bold tracking-wider">Active Emergencies</p>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-[20px] bg-[#ffffff] border border-[#000000] flex items-center gap-3 text-xs text-[#000000] font-bold shadow-none">
        <ShieldAlert className="h-5 w-5 text-[#fb4903] shrink-0" />
        <span>
          <strong>Minimum Necessary Privacy Rule:</strong> Security Officers receive location, severity, and response assistance instructions necessary to respond. Complete medical diagnoses and mental health records are restricted.
        </span>
      </div>

      {/* Sub-Route Tab Renderings */}

      {path.includes('/history') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#ffd731] stroke-[2.5]" />
            Resolved Emergency Incident Logs & History
          </h3>
          <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] text-xs text-[#000000] space-y-2 font-bold">
            <div className="flex justify-between items-center font-bold text-[#000000]">
              <span>Incident #SEC-8841 (Block A Room 301)</span>
              <span className="text-[#000000] bg-[#55db9c] px-3 py-0.5 rounded-[1600px] border border-[#000000] text-[10px]">RESOLVED</span>
            </div>
            <p className="text-[#000000] font-medium">Arrived at 10:34 AM. Room access cleared. Student assisted into Smart Ambulance MP-04-VT-1001.</p>
          </div>
        </div>
      )}

      {path.includes('/location') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <MapPin className="h-5 w-5 text-[#4da2ff] stroke-[2.5]" />
            Campus Room Coordinates & Security Officer Station
          </h3>
          <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] text-xs text-[#000000] space-y-2 font-bold">
            <p className="font-extrabold text-[#000000]">Assigned Gate: Block A Main Security Desk</p>
            <p className="text-[#000000] font-medium">Target Incident Zone: Boys Hostel 1 - Block A - Floor 3 - Room 301</p>
          </div>
        </div>
      )}

      {path.includes('/ambulance-coordination') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#fb4903] stroke-[2.5]" />
            Smart Ambulance Pickup Coordinator & Live Google Maps Tracking
          </h3>

          <LiveAmbulanceMap
            vehicleNumber="MP-04-VT-1001"
            driverName="Ramesh Kumar"
            driverPhone="+91 9988776655"
            destinationText="Block A - Floor 3 - Room 301"
            etaMinutes={3.5}
          />
        </div>
      )}

      {path.includes('/incidents') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#ffd731] stroke-[2.5]" />
            Security Incident Reports & Doorway Clearance Verification
          </h3>
          <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] text-xs text-[#000000] space-y-2 font-bold">
            <p className="font-extrabold text-[#000000]">Report #INC-2026-904</p>
            <p className="text-[#000000] font-medium">Status: Doorway cleared. Elevator locked for emergency response team priority transport.</p>
          </div>
        </div>
      )}

      {/* Main Active Emergencies Queue (Shown on Dashboard & Emergencies routes) */}
      {(path.includes('/dashboard') || path.includes('/emergencies') || path === '/security') && (
        <div className="space-y-5">
          {emergencies.map((emerg) => (
            <div
              key={emerg.id}
              className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-5 shadow-none"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#000000] pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-[1600px] bg-[#ffd731] text-[#000000] border border-[#000000] flex items-center justify-center font-bold">
                    <MapPin className="h-5 w-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
                      Emergency Location: {emerg.location}
                    </h3>
                    <p className="text-xs text-[#000000] font-bold uppercase">Reported By: {emerg.reportedBy || 'Student Emergency Call'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#fb4903] text-white border border-[#000000]">
                    SEVERITY: {emerg.severity}
                  </span>
                  <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#ffd731] text-[#000000] border border-[#000000]">
                    {emerg.status}
                  </span>
                </div>
              </div>

              {/* Live Ambulance Map inside Emergency Card */}
              <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] space-y-3 font-bold">
                <p className="text-xs font-extrabold text-[#000000] flex items-center gap-2 uppercase tracking-wider">
                  <Truck className="h-4 w-4 text-[#fb4903] stroke-[2.5]" />
                  Assigned Smart Ambulance Dispatch Map
                </p>

                <LiveAmbulanceMap
                  vehicleNumber={emerg.ambulance?.vehicleNumber || 'MP-04-VT-1001'}
                  driverName={emerg.ambulance?.driverName || 'Ramesh Kumar'}
                  driverPhone={emerg.ambulance?.driverPhone || '+91 9988776655'}
                  destinationText={emerg.location}
                  etaMinutes={emerg.etaMinutes || 3.5}
                />
              </div>

              {/* Security Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-bold">
                <button
                  onClick={() => setActiveStep('ACCEPTED')}
                  className={`px-5 py-3 rounded-[1600px] font-bold border border-[#000000] cursor-pointer transition-all uppercase tracking-wider ${
                    activeStep === 'ACCEPTED' ? 'bg-[#000000] text-white' : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                  }`}
                >
                  1. Accept Emergency
                </button>

                <button
                  onClick={() => setActiveStep('EN_ROUTE')}
                  className={`px-5 py-3 rounded-[1600px] font-bold border border-[#000000] cursor-pointer transition-all uppercase tracking-wider ${
                    activeStep === 'EN_ROUTE' ? 'bg-[#000000] text-white' : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                  }`}
                >
                  2. En Route to Room
                </button>

                <button
                  onClick={() => setActiveStep('ARRIVED')}
                  className={`px-5 py-3 rounded-[1600px] font-bold border border-[#000000] cursor-pointer transition-all uppercase tracking-wider ${
                    activeStep === 'ARRIVED' ? 'bg-[#55db9c] text-[#000000]' : 'bg-[#ffffff] text-[#000000] hover:bg-[#e9e9e9]'
                  }`}
                >
                  3. Arrived at Student Room
                </button>

                <button
                  onClick={() => setActiveStep('COMPLETED')}
                  className="px-5 py-3 rounded-[1600px] bg-[#55db9c] text-[#000000] font-extrabold border border-[#000000] cursor-pointer uppercase tracking-wider"
                >
                  ✓ Complete Assistance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
