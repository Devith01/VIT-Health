import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROLE_CONFIG } from '../config/roleConfig';
import { RoleName } from '../types/auth';
import {
  HeartPulse,
  LayoutDashboard,
  Stethoscope,
  Calendar,
  ShieldAlert,
  Truck,
  Pill,
  Brain,
  User,
  Layers,
  FileText,
  Clock,
  Award,
  MapPin,
  Activity,
  TrendingUp,
  Bell,
  AlertTriangle,
  MessageSquare,
  PackageCheck,
  Users,
  BarChart,
  Cpu,
  UserCheck,
  Sparkles,
  LogOut,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const ICON_MAP: Record<string, any> = {
  LayoutDashboard,
  Stethoscope,
  Calendar,
  ShieldAlert,
  Truck,
  Pill,
  Brain,
  FileText,
  Clock,
  Award,
  MapPin,
  Activity,
  TrendingUp,
  Bell,
  AlertTriangle,
  MessageSquare,
  PackageCheck,
  Users,
  BarChart,
  Cpu,
  UserCheck,
  Layers,
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const rawRole = user?.role || user?.roleName || 'STUDENT';
  const normalizedRole = rawRole.trim().toUpperCase().replace(/\s+/g, '_') as RoleName;

  const roleConfig = ROLE_CONFIG[normalizedRole] || ROLE_CONFIG.STUDENT;
  const navigationItems = roleConfig ? roleConfig.navigation : ROLE_CONFIG.STUDENT.navigation;

  const homePath = '/student/dashboard';
  return (
    <div className="min-h-screen bg-[#dceeff] text-[#000000] flex flex-col relative font-sans">
      {/* Top Header - Slush Pill Nav & Sticker Aesthetics */}
      <header className="border-b border-[#000000] bg-[#dceeff] sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        {/* Brand Logo Badge */}
        <Link to={homePath} className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-[1600px] bg-[#ffffff] border border-[#000000] flex items-center justify-center text-[#4da2ff] shadow-none transform group-hover:rotate-6 transition-transform">
            <HeartPulse className="h-6 w-6 text-[#fb4903] stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#000000] flex items-center gap-1.5 font-['Space_Grotesk',sans-serif]">
              VIT-HEALTH
            </h1>
            <p className="text-[11px] text-[#000000] font-bold opacity-75">
              Campus Healthcare Portal &bull; VTOP Integrated
            </p>
          </div>
        </Link>

        {/* Slush Capsule Navigation Pill */}
        <nav className="hidden lg:flex items-center gap-2 bg-[#ffffff] px-3 py-1.5 rounded-[1600px] border border-[#000000]">
          {navigationItems.map((item) => {
            const IconComponent = ICON_MAP[item.iconName] || LayoutDashboard;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`px-3.5 py-1.5 rounded-[1600px] text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#000000] text-[#ffffff] border border-[#000000]'
                    : 'text-[#000000] hover:bg-[#e9e9e9] border border-transparent'
                }`}
              >
                <IconComponent className={`h-3.5 w-3.5 ${isActive ? 'text-[#ffd731]' : 'text-[#000000]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Identity & Logout Button */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-[#ffffff] px-4 py-2 rounded-[1600px] border border-[#000000]">
            <User className="h-4 w-4 text-[#4da2ff]" />
            <span className="text-xs font-bold text-[#000000]">
              {user?.fullName || user?.name || 'Student'}
            </span>
            <span className="text-[10px] font-bold text-[#000000] bg-[#e9ccff] border border-[#000000] rounded-[1600px] px-2 py-0.5">
              {normalizedRole.replace(/_/g, ' ')}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Log out of account"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-[1600px] bg-[#ffffff] hover:bg-[#ffe5e5] text-[#fb4903] border border-[#000000] text-xs font-black transition-all cursor-pointer shadow-none hover:border-[#fb4903] active:scale-95"
          >
            <LogOut className="h-3.5 w-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body Canvas */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-8 space-y-8 bg-[#dceeff]">{children}</main>

      {/* Footer */}
      <footer className="border-t border-[#000000] bg-[#ffffff] px-8 py-5 text-center text-xs font-bold text-[#000000] flex items-center justify-between max-w-[1440px] mx-auto w-full rounded-[20px] mb-6">
        <span>VIT-Health Slush Sticker Universe &copy; 2026</span>
        <span className="px-3 py-1 bg-[#55db9c] rounded-[1600px] border border-[#000000] text-xs font-bold">
          Proposed for VTOP Integration &bull; VIT Bhopal
        </span>
      </footer>
    </div>
  );
};
