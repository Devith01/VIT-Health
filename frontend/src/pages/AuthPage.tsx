import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { resetPasswordApi, updateLocationApi } from '../api/auth.api';
import {
  HeartPulse,
  Lock,
  User,
  Phone,
  Building,
  DoorOpen,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  KeyRound,
  ArrowLeft,
  MapPin,
} from 'lucide-react';

const BOYS_HOSTELS = [
  'Boys Hostel 1',
  'Boys Hostel 2',
  'Boys Hostel 3',
  'Boys Hostel 4',
  'Boys Hostel 5',
  'Boys Hostel 6',
  'Boys Hostel 7',
  'Boys Hostel 8',
];

const GIRLS_HOSTELS = [
  'Girls Hostel 1',
  'Girls Hostel 2',
  'Special Block Girls Hostel',
];

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, login, signup } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/student/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const [activeTab, setActiveTab] = useState<'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD' | 'UPDATE_LOCATION'>('LOGIN');

  // Login form state
  const [loginRegNo, setLoginRegNo] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Signup form state
  const [signupFullName, setSignupFullName] = useState('');
  const [signupRegNo, setSignupRegNo] = useState('');
  const [signupMobile, setSignupMobile] = useState('');
  const [signupHostel, setSignupHostel] = useState('');
  const [signupRoom, setSignupRoom] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState<string | null>(null);

  // Forgot Password form state
  const [forgotRegNo, setForgotRegNo] = useState('');
  const [forgotMobile, setForgotMobile] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPassword, setShowForgotNewPassword] = useState(false);
  const [showForgotConfirmPassword, setShowForgotConfirmPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Update Location form state
  const [locRegNo, setLocRegNo] = useState('');
  const [locPassword, setLocPassword] = useState('');
  const [showLocPassword, setShowLocPassword] = useState(false);
  const [locHostel, setLocHostel] = useState('');
  const [locRoom, setLocRoom] = useState('');
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);
  const [locSuccess, setLocSuccess] = useState<string | null>(null);

  // Validate Indian mobile number format
  const isValidIndianMobile = (phone: string): boolean => {
    const cleaned = phone.trim().replace(/\s+/g, '');
    return /^(?:\+91|91)?[6-9]\d{9}$/.test(cleaned);
  };

  // Handle Login submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const regNo = loginRegNo.trim();
    const pwd = loginPassword;

    if (!regNo) {
      setLoginError('Registration number is required.');
      return;
    }

    if (!pwd) {
      setLoginError('Password is required.');
      return;
    }

    setLoginLoading(true);

    try {
      await login(regNo, pwd);
      navigate('/student/dashboard', { replace: true });
    } catch (err: any) {
      console.error('[AuthPage] Login error:', err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Invalid registration number or password';

      // Security requirement: Do not expose whether reg number exists separately from whether password is wrong
      if (
        apiMessage.toLowerCase().includes('not found') ||
        apiMessage.toLowerCase().includes('credentials') ||
        apiMessage.toLowerCase().includes('password')
      ) {
        setLoginError('Invalid registration number or password');
      } else if (apiMessage.toLowerCase().includes('network') || err.code === 'ERR_NETWORK') {
        setLoginError('Healthcare server is currently unreachable. Please try again.');
      } else {
        setLoginError(apiMessage);
      }
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Signup submission
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    setSignupSuccess(null);

    const fullName = signupFullName.trim();
    const regNo = signupRegNo.trim().toUpperCase();
    const mobile = signupMobile.trim();
    const hostel = signupHostel.trim();
    const room = signupRoom.trim();
    const pwd = signupPassword;
    const confirmPwd = signupConfirmPassword;

    // Field validations matching requirements
    if (!fullName) {
      setSignupError('Full name is required.');
      return;
    }

    if (!regNo) {
      setSignupError('Registration number is required.');
      return;
    }

    if (!mobile) {
      setSignupError('Mobile number is required.');
      return;
    }

    if (!isValidIndianMobile(mobile)) {
      setSignupError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!hostel) {
      setSignupError('Please select your hostel.');
      return;
    }

    if (!room) {
      setSignupError('Please enter your room number.');
      return;
    }

    if (!pwd) {
      setSignupError('Password is required.');
      return;
    }

    if (pwd.length < 8) {
      setSignupError('Password must be at least 8 characters long.');
      return;
    }

    if (pwd !== confirmPwd) {
      setSignupError('Passwords do not match.');
      return;
    }

    setSignupLoading(true);

    try {
      await signup({
        fullName,
        name: fullName,
        registrationNumber: regNo,
        mobileNumber: mobile,
        hostelBlock: hostel,
        roomNumber: room,
        password: pwd,
        confirmPassword: confirmPwd,
      });

      setSignupSuccess('Account created successfully! Please log in with your credentials.');
      setLoginRegNo(regNo);
      setLoginPassword('');
      // Reset signup form
      setSignupFullName('');
      setSignupRegNo('');
      setSignupMobile('');
      setSignupHostel('');
      setSignupRoom('');
      setSignupPassword('');
      setSignupConfirmPassword('');

      // Transition to Login tab after short delay
      setTimeout(() => {
        setActiveTab('LOGIN');
      }, 1500);
    } catch (err: any) {
      console.error('[AuthPage] Signup error:', err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to create student account.';

      if (err.response?.status === 409 || apiMessage.includes('already exists')) {
        setSignupError('Registration number already exists.');
      } else if (apiMessage.toLowerCase().includes('network') || err.code === 'ERR_NETWORK') {
        setSignupError('Healthcare server is currently unreachable. Please check your connection.');
      } else {
        setSignupError(apiMessage);
      }
    } finally {
      setSignupLoading(false);
    }
  };

  // Handle Forgot Password submission
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    const regNo = forgotRegNo.trim().toUpperCase();
    const mobile = forgotMobile.trim();
    const newPwd = forgotNewPassword;
    const confirmPwd = forgotConfirmPassword;

    if (!regNo) {
      setForgotError('Registration number is required.');
      return;
    }

    if (!mobile) {
      setForgotError('Mobile number is required.');
      return;
    }

    if (!isValidIndianMobile(mobile)) {
      setForgotError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!newPwd) {
      setForgotError('New password is required.');
      return;
    }

    if (newPwd.length < 8) {
      setForgotError('Password must be at least 8 characters long.');
      return;
    }

    if (newPwd !== confirmPwd) {
      setForgotError('Passwords do not match.');
      return;
    }

    setForgotLoading(true);

    try {
      await resetPasswordApi({
        registrationNumber: regNo,
        mobileNumber: mobile,
        newPassword: newPwd,
        confirmNewPassword: confirmPwd,
      });

      setForgotSuccess('Password updated successfully! Please log in with your new password.');
      setLoginRegNo(regNo);
      setLoginPassword('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');

      setTimeout(() => {
        setActiveTab('LOGIN');
        setForgotSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error('[AuthPage] Forgot password error:', err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Invalid registration number or mobile number.';

      if (apiMessage.toLowerCase().includes('network') || err.code === 'ERR_NETWORK') {
        setForgotError('Healthcare server is currently unreachable. Please check your connection.');
      } else {
        setForgotError(apiMessage);
      }
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle Location Update submission
  const handleUpdateLocationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocError(null);
    setLocSuccess(null);

    const regNo = locRegNo.trim().toUpperCase();
    const pwd = locPassword;
    const hostel = locHostel.trim();
    const room = locRoom.trim();

    if (!regNo) {
      setLocError('Registration number is required.');
      return;
    }

    if (!pwd) {
      setLocError('Password is required.');
      return;
    }

    if (!hostel) {
      setLocError('Please select your new hostel.');
      return;
    }

    if (!room) {
      setLocError('Please enter your new room number.');
      return;
    }

    setLocLoading(true);

    try {
      await updateLocationApi({
        registrationNumber: regNo,
        password: pwd,
        hostelBlock: hostel,
        roomNumber: room,
      });

      setLocSuccess('Hostel and room updated permanently! Please log in.');
      setLoginRegNo(regNo);
      setLocPassword('');
      setLocHostel('');
      setLocRoom('');

      setTimeout(() => {
        setActiveTab('LOGIN');
        setLocSuccess(null);
      }, 1500);
    } catch (err: any) {
      console.error('[AuthPage] Update location error:', err);
      const apiMessage =
        err?.response?.data?.message ||
        err?.message ||
        'Invalid registration number or password.';

      if (apiMessage.toLowerCase().includes('network') || err.code === 'ERR_NETWORK') {
        setLocError('Healthcare server is currently unreachable. Please check your connection.');
      } else {
        setLocError(apiMessage);
      }
    } finally {
      setLocLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#dceeff] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-[#000000]">
      {/* Container */}
      <div className="w-full max-w-lg space-y-6">
        {/* App Logo / Healthcare Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#5c4ade] text-white border border-black shadow-sm text-xs font-bold uppercase tracking-wider">
            <HeartPulse className="h-4 w-4 animate-pulse text-[#55db9c]" />
            <span>VIT Bhopal &bull; Emergency Telemedicine</span>
          </div>

          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black font-['Space_Grotesk',sans-serif]">
              TELEMEDICINE
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold tracking-wide text-[#5c4ade]">
              STUDENT PORTAL
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 font-medium max-w-sm mx-auto">
            Secure access to AI-powered campus healthcare, rapid emergency ambulance dispatch, and clinic appointments.
          </p>
        </div>

        {/* Main Authentication Card */}
        <div className="bg-white border-2 border-black rounded-[28px] p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
          {/* Tabs: LOGIN / SIGN UP (Shown only when in Login or Signup mode) */}
          {activeTab === 'LOGIN' || activeTab === 'SIGNUP' ? (
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#e9e9e9] border border-black rounded-[18px] mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('LOGIN');
                  setLoginError(null);
                  setSignupError(null);
                }}
                className={`py-2.5 text-xs sm:text-sm font-extrabold rounded-[14px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'LOGIN'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-black hover:bg-white/60'
                }`}
              >
                <User className="h-4 w-4" />
                <span>LOGIN</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('SIGNUP');
                  setLoginError(null);
                  setSignupError(null);
                }}
                className={`py-2.5 text-xs sm:text-sm font-extrabold rounded-[14px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === 'SIGNUP'
                    ? 'bg-black text-white shadow-sm'
                    : 'text-black hover:bg-white/60'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>SIGN UP</span>
              </button>
            </div>
          ) : activeTab === 'FORGOT_PASSWORD' ? (
            /* Forgot Password Top Navigation Header */
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('LOGIN');
                  setForgotError(null);
                  setForgotSuccess(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5c4ade] hover:underline cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Login</span>
              </button>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <KeyRound className="h-3.5 w-3.5" />
                <span>Password Recovery</span>
              </span>
            </div>
          ) : (
            /* Update Location Top Navigation Header */
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('LOGIN');
                  setLocError(null);
                  setLocSuccess(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5c4ade] hover:underline cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Login</span>
              </button>
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Building className="h-3.5 w-3.5" />
                <span>Update Location</span>
              </span>
            </div>
          )}

          {/* Alert: Success Notification */}
          {(signupSuccess || forgotSuccess || locSuccess) && (
            <div className="mb-5 p-3.5 rounded-[14px] bg-[#55db9c]/20 border border-[#55db9c] text-[#0f5132] text-xs sm:text-sm font-bold flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#0f5132]" />
              <span>{signupSuccess || forgotSuccess || locSuccess}</span>
            </div>
          )}

          {/* ======================================================= */}
          {/* TAB 1: LOGIN FORM */}
          {/* ======================================================= */}
          {activeTab === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3.5 rounded-[14px] bg-[#fb4903]/10 border border-[#fb4903] text-[#b02a37] text-xs sm:text-sm font-bold flex items-center gap-2.5">
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#fb4903]" />
                  <span>{loginError}</span>
                </div>
              )}

              {/* Registration Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  Registration Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={loginRegNo}
                    onChange={(e) => setLoginRegNo(e.target.value)}
                    placeholder="e.g. 25BHI10021"
                    className="w-full pl-10 pr-4 py-3 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all uppercase"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('FORGOT_PASSWORD');
                      setForgotError(null);
                      setForgotSuccess(null);
                      setForgotRegNo(loginRegNo);
                    }}
                    className="text-xs font-bold text-[#5c4ade] hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-black transition-colors"
                  >
                    {showLoginPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3.5 px-4 rounded-[1600px] bg-[#5c4ade] text-white border-2 border-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#4939b8] active:translate-y-0.5 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {loginLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <>
                    <span>LOGIN</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              {/* Switch to Signup & Update Location */}
              <div className="text-center pt-3 border-t border-slate-200 space-y-2">
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('SIGNUP');
                      setLoginError(null);
                    }}
                    className="font-bold text-[#5c4ade] hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('UPDATE_LOCATION');
                      setLocError(null);
                      setLocSuccess(null);
                      setLocRegNo(loginRegNo);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-black bg-slate-100 hover:bg-[#ffd731]/40 px-3 py-1.5 rounded-[12px] border border-black transition-all cursor-pointer"
                  >
                    <Building className="h-3.5 w-3.5 text-[#5c4ade]" />
                    <span>Changed Room / Hostel? Update Location</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ======================================================= */}
          {/* TAB 2: SIGN UP FORM */}
          {/* ======================================================= */}
          {activeTab === 'SIGNUP' && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {signupError && (
                <div className="p-3.5 rounded-[14px] bg-[#fb4903]/10 border border-[#fb4903] text-[#b02a37] text-xs sm:text-sm font-bold flex items-center gap-2.5">
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#fb4903]" />
                  <span>{signupError}</span>
                </div>
              )}

              {/* 1. Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  1. Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    placeholder="e.g. Aarav Patel"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* 2. Registration Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  2. Registration Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={signupRegNo}
                    onChange={(e) => setSignupRegNo(e.target.value)}
                    placeholder="e.g. 25BHI10021"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all uppercase"
                    required
                  />
                </div>
              </div>

              {/* 3. Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  3. Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    value={signupMobile}
                    onChange={(e) => setSignupMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* 4. Hostel / Block Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  4. Hostel / Block
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Building className="h-4 w-4" />
                  </div>
                  <select
                    value={signupHostel}
                    onChange={(e) => setSignupHostel(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all cursor-pointer"
                    required
                  >
                    <option value="">[ Select Hostel ]</option>
                    <optgroup label="BOYS HOSTELS">
                      {BOYS_HOSTELS.map((hostel) => (
                        <option key={hostel} value={hostel}>
                          {hostel}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="GIRLS HOSTELS">
                      {GIRLS_HOSTELS.map((hostel) => (
                        <option key={hostel} value={hostel}>
                          {hostel}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* 5. Room Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  5. Room Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <DoorOpen className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={signupRoom}
                    onChange={(e) => setSignupRoom(e.target.value)}
                    placeholder="e.g. D-304, A-205, B4-302"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* 6. Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  6. Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-10 pr-11 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-black transition-colors"
                  >
                    {showSignupPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 7. Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  7. Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showSignupConfirmPassword ? 'text' : 'password'}
                    value={signupConfirmPassword}
                    onChange={(e) => setSignupConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-black transition-colors"
                  >
                    {showSignupConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={signupLoading}
                className="w-full py-3.5 px-4 rounded-[1600px] bg-[#55db9c] text-black border-2 border-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#43ca8a] active:translate-y-0.5 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {signupLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </span>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    <span>CREATE ACCOUNT</span>
                  </>
                )}
              </button>

              {/* Switch to Login */}
              <div className="text-center pt-3 border-t border-slate-200">
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('LOGIN');
                      setSignupError(null);
                    }}
                    className="font-bold text-[#5c4ade] hover:underline cursor-pointer"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </form>
          )}

          {/* ======================================================= */}
          {/* TAB 3: FORGOT / RESET PASSWORD FORM */}
          {/* ======================================================= */}
          {activeTab === 'FORGOT_PASSWORD' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="space-y-1 mb-2">
                <h3 className="text-lg font-extrabold text-black flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-[#5c4ade]" />
                  <span>Change Password</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Verify your registration number and registered mobile number to set a new password.
                </p>
              </div>

              {forgotError && (
                <div className="p-3.5 rounded-[14px] bg-[#fb4903]/10 border border-[#fb4903] text-[#b02a37] text-xs sm:text-sm font-bold flex items-center gap-2.5">
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#fb4903]" />
                  <span>{forgotError}</span>
                </div>
              )}

              {/* 1. Registration Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  Registration Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={forgotRegNo}
                    onChange={(e) => setForgotRegNo(e.target.value)}
                    placeholder="e.g. 25BHI10021"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all uppercase"
                    required
                  />
                </div>
              </div>

              {/* 2. Registered Mobile Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  Registered Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    value={forgotMobile}
                    onChange={(e) => setForgotMobile(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* 3. New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showForgotNewPassword ? 'text' : 'password'}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full pl-10 pr-11 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotNewPassword(!showForgotNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-black transition-colors"
                  >
                    {showForgotNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 4. Confirm New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showForgotConfirmPassword ? 'text' : 'password'}
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all"
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowForgotConfirmPassword(!showForgotConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-black transition-colors"
                  >
                    {showForgotConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={forgotLoading}
                className="w-full py-3.5 px-4 rounded-[1600px] bg-[#ffd731] text-black border-2 border-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#f1c925] active:translate-y-0.5 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {forgotLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Updating Password...
                  </span>
                ) : (
                  <>
                    <KeyRound className="h-4 w-4" />
                    <span>UPDATE PASSWORD</span>
                  </>
                )}
              </button>

              {/* Cancel / Back to Login */}
              <div className="text-center pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('LOGIN');
                    setForgotError(null);
                  }}
                  className="text-xs sm:text-sm font-bold text-slate-600 hover:text-black hover:underline cursor-pointer"
                >
                  Cancel &bull; Back to Login
                </button>
              </div>
            </form>
          )}

          {/* ======================================================= */}
          {/* TAB 4: UPDATE HOSTEL / ROOM LOCATION FORM */}
          {/* ======================================================= */}
          {activeTab === 'UPDATE_LOCATION' && (
            <form onSubmit={handleUpdateLocationSubmit} className="space-y-4">
              <div className="space-y-1 mb-2">
                <h3 className="text-lg font-extrabold text-black flex items-center gap-2">
                  <Building className="h-5 w-5 text-[#5c4ade]" />
                  <span>Update Room &amp; Hostel Location</span>
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  Moved to a new room? Update your permanent hostel and room allocation record.
                </p>
              </div>

              {locError && (
                <div className="p-3.5 rounded-[14px] bg-[#fb4903]/10 border border-[#fb4903] text-[#b02a37] text-xs sm:text-sm font-bold flex items-center gap-2.5">
                  <AlertCircle className="h-5 w-5 shrink-0 text-[#fb4903]" />
                  <span>{locError}</span>
                </div>
              )}

              {/* 1. Registration Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  1. Registration Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={locRegNo}
                    onChange={(e) => setLocRegNo(e.target.value)}
                    placeholder="e.g. 25BHI10021"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all uppercase"
                    required
                  />
                </div>
              </div>

              {/* 2. Password (Authentication) */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  2. Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showLocPassword ? 'text' : 'password'}
                    value={locPassword}
                    onChange={(e) => setLocPassword(e.target.value)}
                    placeholder="Enter your account password"
                    className="w-full pl-10 pr-11 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLocPassword(!showLocPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-black transition-colors"
                  >
                    {showLocPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* 3. New Hostel / Block */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  3. New Hostel / Block
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Building className="h-4 w-4" />
                  </div>
                  <select
                    value={locHostel}
                    onChange={(e) => setLocHostel(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all cursor-pointer"
                    required
                  >
                    <option value="">[ Select New Hostel ]</option>
                    <optgroup label="BOYS HOSTELS">
                      {BOYS_HOSTELS.map((hostel) => (
                        <option key={hostel} value={hostel}>
                          {hostel}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="GIRLS HOSTELS">
                      {GIRLS_HOSTELS.map((hostel) => (
                        <option key={hostel} value={hostel}>
                          {hostel}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* 4. New Room Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-black uppercase tracking-wider block">
                  4. New Room Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <DoorOpen className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    value={locRoom}
                    onChange={(e) => setLocRoom(e.target.value)}
                    placeholder="e.g. D-304, A-205, B4-302"
                    className="w-full pl-10 pr-4 py-2.5 rounded-[14px] bg-slate-50 border border-black text-sm font-semibold text-black placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5c4ade] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={locLoading}
                className="w-full py-3.5 px-4 rounded-[1600px] bg-[#55db9c] text-black border-2 border-black font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#45ca8b] active:translate-y-0.5 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              >
                {locLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Updating Location...
                  </span>
                ) : (
                  <>
                    <Building className="h-4 w-4" />
                    <span>PERMANENTLY UPDATE LOCATION</span>
                  </>
                )}
              </button>

              {/* Cancel / Back to Login */}
              <div className="text-center pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('LOGIN');
                    setLocError(null);
                  }}
                  className="text-xs sm:text-sm font-bold text-slate-600 hover:text-black hover:underline cursor-pointer"
                >
                  Cancel &bull; Back to Login
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer info banner */}
        <div className="p-4 rounded-[20px] bg-white/70 border border-black/40 text-center text-xs font-semibold text-slate-700 flex items-center justify-center gap-2">
          <Stethoscope className="h-4 w-4 text-[#5c4ade] shrink-0" />
          <span>Equipped with XGBoost Emergency Triage &amp; PhysioNet MIMIC-IV Clinical Models</span>
        </div>
      </div>
    </div>
  );
};
