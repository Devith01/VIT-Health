import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Info, MessageSquare } from 'lucide-react';

export const FloorRepresentativeDashboard: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const [isAlertAcknowledged, setIsAlertAcknowledged] = useState<boolean>(false);
  const [broadcastSent, setBroadcastSent] = useState<boolean>(false);
  const [sanitationReport, setSanitationReport] = useState<string>('');
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReportSubmitted(true);
  };

  return (
    <div className="space-y-6 text-[#000000]">
      {/* Header Banner */}
      <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] shadow-none flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#e9ccff] text-[#000000] border border-[#000000]">
              FLOOR HEALTH REPRESENTATIVE
            </span>
            <span className="text-xs text-[#000000] font-bold uppercase tracking-wider">Assigned Location: Block A - Floor 3</span>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight font-['Space_Grotesk']">Floor Health Coordination & Sanitation Advisories</h2>
          <p className="text-xs text-[#000000] max-w-xl font-medium">
            Coordinate health advisory notifications, monitor aggregated illness case trends on your floor, broadcast sanitation precautions, and report environmental concerns.
          </p>
        </div>

        <div className="p-4 rounded-[20px] bg-[#ffd731] border border-[#000000] text-center shrink-0">
          <p className="text-3xl font-extrabold text-[#000000]">9</p>
          <p className="text-[10px] uppercase font-bold tracking-wider">Aggregated Floor Cases</p>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="p-4 rounded-[20px] bg-[#ffffff] border border-[#000000] flex items-center gap-3 text-xs text-[#000000] font-bold shadow-none">
        <Info className="h-5 w-5 text-[#5c4ade] shrink-0" />
        <span>
          <strong>Privacy Access Rule:</strong> Floor Representatives receive aggregated case counts and category summaries for their assigned floor only. Individual student names, room numbers, and detailed medical records are restricted to maintain privacy.
        </span>
      </div>

      {/* Sub-Route Specific Views */}

      {path.includes('/report-issue') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-[#fb4903] stroke-[2.5]" />
            Report Environmental or Water Sanitation Issue
          </h3>

          {reportSubmitted ? (
            <div className="p-4 rounded-[20px] bg-[#55db9c] border border-[#000000] text-[#000000] text-xs flex items-center gap-2 font-bold">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Sanitation concern reported to Campus Health Administration & Hostel Maintenance!</span>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block font-bold text-[#000000] mb-1 uppercase tracking-wider text-[10px]">Environmental / Water Concern Details</label>
                <textarea
                  rows={3}
                  value={sanitationReport}
                  onChange={(e) => setSanitationReport(e.target.value)}
                  placeholder="Describe water cooler quality, food hygiene, or waste disposal issues on Floor 3..."
                  className="w-full p-4 rounded-[20px] bg-[#ffffff] border border-[#000000] text-[#000000] font-bold outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-[1600px] bg-[#000000] text-white hover:bg-[#333333] font-extrabold text-xs border border-[#000000] cursor-pointer uppercase tracking-wider"
              >
                Submit Environmental Health Report
              </button>
            </form>
          )}
        </div>
      )}

      {path.includes('/notifications') && (
        <div className="p-8 rounded-[30px] bg-[#ffffff] border border-[#000000] space-y-4 shadow-none">
          <h3 className="text-base font-extrabold text-[#000000] flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-[#4da2ff] stroke-[2.5]" />
            Floor Precaution Broadcaster & Notifications
          </h3>
          <div className="p-4 rounded-[20px] bg-[#dceeff] border border-[#000000] text-xs text-[#000000] space-y-2 font-bold">
            <p className="font-extrabold text-[#000000]">Broadcast Alert: Drinking Water Boil Advisory</p>
            <p className="text-[#000000] font-medium">Broadcasted to all 32 rooms on Block A Floor 3 at 09:15 AM.</p>
          </div>
        </div>
      )}

      {/* Main Floor Health Alert & Trends (Shown on Dashboard, Alerts, Trends & Emergency-Alerts routes) */}
      {(path.includes('/dashboard') || path.includes('/alerts') || path.includes('/trends') || path.includes('/emergency-alerts') || path === '/floor-representative') && (
        <>
          <div className="p-8 rounded-[30px] bg-[#ffd731] border border-[#000000] space-y-4 shadow-none">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-extrabold text-[#000000] text-base">
                <AlertTriangle className="h-5 w-5 text-[#fb4903] stroke-[2.5]" />
                <span>Active Outbreak Warning: Block A - Floor 3</span>
              </div>
              <span className="px-3.5 py-1 rounded-[1600px] text-xs font-bold bg-[#fb4903] text-white border border-[#000000]">
                RISK: HIGH
              </span>
            </div>

            <p className="text-xs text-[#000000] font-bold">
              9 aggregated cases of gastroenteritis / food poisoning recorded on Floor 3 in the past 24 hours (Threshold: 10). Immediate floor-wide drinking water boiling & hand sanitation advisories recommended.
            </p>

            <div className="pt-2 flex items-center gap-3 text-xs font-bold">
              <button
                onClick={() => setIsAlertAcknowledged(true)}
                disabled={isAlertAcknowledged}
                className={`px-5 py-3 rounded-[1600px] font-bold cursor-pointer transition-all border border-[#000000] uppercase tracking-wider ${
                  isAlertAcknowledged
                    ? 'bg-[#55db9c] text-[#000000]'
                    : 'bg-[#fb4903] text-white'
                }`}
              >
                {isAlertAcknowledged ? '✓ Alert Acknowledged' : 'Acknowledge Floor Alert'}
              </button>

              <button
                onClick={() => setBroadcastSent(true)}
                className="px-5 py-3 rounded-[1600px] bg-[#ffffff] hover:bg-[#e9e9e9] text-[#000000] font-bold border border-[#000000] cursor-pointer uppercase tracking-wider"
              >
                {broadcastSent ? '✓ Notice Broadcasted' : 'Broadcast Common-Area Notice'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] space-y-2 shadow-none">
              <p className="text-[11px] text-[#000000] uppercase font-extrabold tracking-wider">Primary Category</p>
              <p className="text-lg font-extrabold text-[#000000]">Food Poisoning / Gastroenteritis</p>
              <p className="text-xs text-[#000000] font-bold">9 Aggregated Cases</p>
            </div>

            <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] space-y-2 shadow-none">
              <p className="text-[11px] text-[#000000] uppercase font-extrabold tracking-wider">24-Hour Trend</p>
              <p className="text-lg font-extrabold text-[#fb4903]">INCREASING (+3 today)</p>
              <p className="text-xs text-[#000000] font-bold">Floor Threshold: 10 Cases</p>
            </div>

            <div className="p-6 rounded-[20px] bg-[#ffffff] border border-[#000000] space-y-2 shadow-none">
              <p className="text-[11px] text-[#000000] uppercase font-extrabold tracking-wider">Sanitation Status</p>
              <p className="text-lg font-extrabold text-[#000000]">Inspection Request Pending</p>
              <p className="text-xs text-[#000000] font-bold">Mess & Water Cooler Sanitation</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
