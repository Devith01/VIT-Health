import React from 'react';
import { Navigate, Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RoleName } from '../types/auth';
import { ROLE_CONFIG } from '../config/roleConfig';
import { Sparkles, ShieldAlert } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: RoleName[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading, loginDemoUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-cyan-400 font-medium text-sm">
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = user.role || user.roleName || 'STUDENT';
  const roleConfig = ROLE_CONFIG[currentRole] || ROLE_CONFIG.STUDENT;

  // Check explicit route permission from ROLE_CONFIG
  const isExplicitlyAllowed = allowedRoles ? allowedRoles.includes(currentRole) : true;
  const isConfigRouteAllowed = roleConfig.allowedRoutes.some((route) =>
    location.pathname.startsWith(route)
  );

  const handleQuickSwitch = async (role: RoleName) => {
    const newUser = await loginDemoUser(role);
    const targetDashboard = ROLE_CONFIG[role]?.dashboard || '/student/dashboard';
    navigate(targetDashboard, { replace: true });
  };

  if (!isExplicitlyAllowed && !isConfigRouteAllowed) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
        <div className="h-14 w-14 rounded-2xl bg-rose-950 border border-rose-800 text-rose-400 flex items-center justify-center font-bold text-2xl shadow-xl">
          <ShieldAlert className="h-7 w-7" />
        </div>

        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-bold">Access Denied (RBAC Enforced)</h2>
          <p className="text-xs text-slate-400">
            Your current role <span className="font-mono font-bold text-rose-400 bg-rose-950 px-2 py-0.5 rounded border border-rose-800">{currentRole}</span> is restricted from accessing this module to enforce Strict Role Isolation.
          </p>
        </div>

        {/* Quick Switch Helper */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 max-w-lg w-full space-y-3 shadow-xl">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>Exhibition Quick Role Switcher</span>
          </div>
          <p className="text-[11px] text-slate-400">Click any role below to instantly switch to that dashboard:</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono font-semibold">
            <button onClick={() => handleQuickSwitch('DOCTOR')} className="p-2 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 cursor-pointer">
              DOCTOR
            </button>
            <button onClick={() => handleQuickSwitch('ADMIN')} className="p-2 rounded-xl bg-purple-950 hover:bg-purple-900 text-purple-300 border border-purple-800 cursor-pointer">
              ADMIN
            </button>
            <button onClick={() => handleQuickSwitch('SECURITY_OFFICER')} className="p-2 rounded-xl bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 cursor-pointer">
              SECURITY
            </button>
            <button onClick={() => handleQuickSwitch('AMBULANCE_OFFICER')} className="p-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 cursor-pointer">
              AMBULANCE
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link to={roleConfig.dashboard} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold border border-slate-700">
            Return to My Dashboard
          </Link>
          <Link to="/student/dashboard" className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow">
            Open Student Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};
