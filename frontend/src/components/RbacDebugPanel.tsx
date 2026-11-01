import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ROLE_CONFIG } from '../config/roleConfig';
import { Bug, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export const RbacDebugPanel: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const currentRole = user.role || user.roleName || 'STUDENT';
  const roleConfig = ROLE_CONFIG[currentRole] || ROLE_CONFIG.STUDENT;

  return (
    <div className="fixed bottom-4 right-4 z-50 text-xs font-bold text-carbon">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-[1600px] bg-paper-white border border-carbon text-carbon shadow-none flex items-center gap-2 hover:bg-concrete-gray transition-all cursor-pointer"
      >
        <Bug className="h-4 w-4 text-[#fb4903]" />
        <span>RBAC Sync Monitor</span>
        <span className="bg-[#e9ccff] px-2.5 py-0.5 rounded-[1600px] border border-carbon text-carbon font-extrabold">{currentRole}</span>
        {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-carbon" /> : <ChevronUp className="h-3.5 w-3.5 text-carbon" />}
      </button>

      {isOpen && (
        <div className="mt-2 w-80 p-5 rounded-[20px] bg-paper-white border border-carbon text-carbon shadow-none space-y-3 font-medium">
          <div className="flex items-center justify-between border-b border-carbon/20 pb-2">
            <span className="font-bold text-carbon flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-[#55db9c]" /> Live RBAC Session
            </span>
            <span className="text-[10px] text-carbon/60 font-bold uppercase">Single Source of Truth</span>
          </div>

          <div className="space-y-2 text-[11px]">
            <div>
              <span className="text-carbon/60 uppercase font-bold">User Name: </span>
              <span className="font-bold text-carbon">{user.name || user.fullName}</span>
            </div>

            <div>
              <span className="text-carbon/60 uppercase font-bold">Current Role: </span>
              <span className="px-2.5 py-0.5 rounded-[1600px] bg-[#e9ccff] text-carbon border border-carbon font-bold">
                {currentRole}
              </span>
            </div>

            <div>
              <span className="text-carbon/60 uppercase font-bold">Dashboard Path: </span>
              <span className="text-carbon font-bold bg-[#ffd731] px-2 py-0.5 rounded-[1600px] border border-carbon">{roleConfig.dashboard}</span>
            </div>

            <div>
              <span className="text-carbon/60 uppercase font-bold">Allowed Routes ({roleConfig.allowedRoutes.length}): </span>
              <div className="mt-1 max-h-24 overflow-y-auto space-y-0.5 bg-[#dceeff]/30 p-2 rounded-[12px] border border-carbon text-[10px] text-carbon font-bold">
                {roleConfig.allowedRoutes.map((r) => (
                  <div key={r}>✓ {r}</div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-carbon/60 uppercase font-bold">Menu Items ({roleConfig.navigation.length}): </span>
              <div className="mt-1 max-h-24 overflow-y-auto space-y-0.5 bg-[#dceeff]/30 p-2 rounded-[12px] border border-carbon text-[10px] text-carbon font-bold">
                {roleConfig.navigation.map((n) => (
                  <div key={n.label}>• {n.label} ({n.path})</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
