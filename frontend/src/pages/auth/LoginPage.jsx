import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import {
  ShieldCheck,
  Lock,
  User,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
  Quote,
  Shield,
} from 'lucide-react';
import collegeLogoImg from '../../assets/college_logo.png';

export const LoginPage = () => {
  const [role, setRole] = useState('STUDENT'); // 'STUDENT' | 'WARDEN'
  const [username, setUsername] = useState('ananya');
  const [password, setPassword] = useState('Student@Sakhi2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleRoleSwitch = (selectedRole) => {
    setRole(selectedRole);
    setErrorMsg('');
    if (selectedRole === 'STUDENT') {
      setUsername('ananya');
      setPassword('Student@Sakhi2026');
    } else {
      setUsername('warden');
      setPassword('Warden@Sakhi2026');
    }
  };

  const handleQuickDemo = (demoType) => {
    if (demoType === 'STUDENT') {
      setRole('STUDENT');
      setUsername('ananya');
      setPassword('Student@Sakhi2026');
      toast.info('Filled credentials for Resident Student (Ananya Sharma)');
    } else {
      setRole('WARDEN');
      setUsername('warden');
      setPassword('Warden@Sakhi2026');
      toast.info('Filled credentials for Chief Warden (Kranti Bhoyar)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const authData = await login({
        username,
        password,
        role,
        rememberMe,
      });

      toast.success(`Welcome back, ${authData.fullName}!`);
      if (authData.role === 'ROLE_WARDEN') {
        navigate('/warden/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
      toast.error(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 antialiased selection:bg-rose-100 selection:text-wine-900">
      {/* ========================================================================= */}
      {/* LEFT SIDE: Luminous Institutional Brand Showcase (Light & Aesthetic)     */}
      {/* ========================================================================= */}
      <div className="lg:w-7/12 xl:w-3/5 bg-gradient-to-br from-rose-50/80 via-white to-amber-50/40 text-slate-900 p-8 sm:p-12 lg:p-14 xl:p-16 flex flex-col justify-between relative overflow-hidden min-h-[560px] lg:min-h-screen border-b lg:border-b-0 lg:border-r border-slate-200/80">
        {/* Subtle Architectural Dot Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.08] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(rgba(15, 23, 42, 0.9) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Ambient Soft Rosé and Warm Amber Glow Orbs */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-rose-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 -right-24 w-[28rem] h-[28rem] bg-amber-200/35 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute -bottom-16 left-1/3 w-80 h-80 bg-rose-100/50 rounded-full blur-[90px] pointer-events-none" />

        {/* 1. Header with Official College Emblem */}
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white ring-2 ring-amber-500/30 p-1 shadow-md border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
              <img
                src={collegeLogoImg}
                alt="Mauli Group of Institutions Shegaon Official Seal"
                className="w-full h-full object-contain rounded-full select-none"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100/80 border border-amber-300/60 text-[10px] font-black uppercase tracking-widest text-amber-900 mb-1 shadow-2xs">
                <span>★ Mauli Group of Institutions</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                Sakhi Girls Hostel
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">
                College of Engineering & Technology, Shegaon
              </p>
            </div>
          </div>
        </div>

        {/* 2. Main Hero Typography & Value Cards */}
        <div className="relative z-10 my-8 lg:my-6 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-rose-200/80 text-xs font-semibold text-rose-800 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Excellence in Girls Student Living • MGICOET Shegaon</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[3.25rem] font-bold tracking-tight text-slate-900 leading-[1.14]">
            A sanctuary designed for{' '}
            <span className="block mt-1 font-serif italic text-wine-900 font-bold">
              excellence, dignity, & security.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-lg">
            Under Chief Warden <strong className="text-slate-900 font-semibold">Kranti Bhoyar</strong>, Sakhi Girls Hostel provides secure biometric accommodation, transparent digital leave workflows, and 24/7 security for 400 resident women engineers.
          </p>

          {/* Interactive Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="p-4 rounded-2xl bg-white/85 hover:bg-white backdrop-blur-md border border-slate-200/80 transition-all shadow-xs hover:shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 flex-shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">24/7 Monitored Campus</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Female security, CCTV & 9:00 PM curfew</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/85 hover:bg-white backdrop-blur-md border border-slate-200/80 transition-all shadow-xs hover:shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 flex-shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">100 Rooms • 400 Beds</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Warden-managed 4-bed study suites</p>
                </div>
              </div>
            </div>
          </div>

          {/* Chief Warden Institutional Endorsement Card */}
          <div className="p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-rose-100 shadow-sm relative">
            <Quote className="w-6 h-6 text-rose-300 absolute top-3 right-3" />
            <p className="text-xs text-slate-700 italic leading-relaxed pr-6">
              "Our utmost priority is ensuring a protected, disciplined, and nurturing environment where every young woman engineer thrives academically and personally."
            </p>
            <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[11px]">
              <span className="font-bold text-wine-900">Chief Warden Kranti Bhoyar</span>
              <span className="text-slate-500 font-medium">Head of Student Welfare</span>
            </div>
          </div>
        </div>

        {/* 3. Footer Credentials */}
        <div className="relative z-10 pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mauli Group of Institutions Campus • Shegaon, Maharashtra - 444503</span>
          </div>
          <span className="font-semibold text-slate-700">Approved by AICTE • Affiliated to SGBAU</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT SIDE: Clean & Polished Authentication Card                          */}
      {/* ========================================================================= */}
      <div className="lg:w-5/12 xl:w-2/5 flex items-center justify-center p-6 sm:p-10 lg:p-12 xl:p-16 bg-slate-50/70">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-9 shadow-card border border-slate-200/80">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 text-wine-900 border border-rose-100 mb-3 shadow-2xs">
              <Lock className="w-6 h-6 text-wine-900" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Sign In to Your Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Protected authentication for residents and hostel administration
            </p>
          </div>

          {/* Quick Demo Credentials Autofill Pills */}
          <div className="mb-5 p-3 rounded-2xl bg-slate-50 border border-slate-200/70">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2 text-center">
              Quick One-Click Demo Access
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('STUDENT')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition border text-center flex items-center justify-center gap-1.5 ${
                  role === 'STUDENT'
                    ? 'bg-rose-50 text-wine-900 border-rose-300 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-wine-800" />
                <span>Student Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('WARDEN')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition border text-center flex items-center justify-center gap-1.5 ${
                  role === 'WARDEN'
                    ? 'bg-amber-50 text-amber-900 border-amber-300 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-700" />
                <span>Warden Demo</span>
              </button>
            </div>
          </div>

          {/* Segmented Role Selector */}
          <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200 mb-5">
            <button
              type="button"
              onClick={() => handleRoleSwitch('STUDENT')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                role === 'STUDENT'
                  ? 'bg-wine-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Resident Student
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('WARDEN')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                role === 'WARDEN'
                  ? 'bg-wine-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4" />
              Chief Warden
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3.5 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800 animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username or Institutional Email"
              name="username"
              required
              icon={User}
              placeholder={role === 'STUDENT' ? 'e.g. ananya' : 'e.g. warden'}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <div className="relative">
              <Input
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                icon={Lock}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[38px] text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-wine-900 focus:ring-wine-800"
                />
                <span>Remember this session</span>
              </label>

              <button
                type="button"
                onClick={() => toast.info(`Default demo credentials ready for ${role}. Click Sign In!`)}
                className="font-semibold text-wine-800 hover:text-wine-950 hover:underline"
              >
                Forgot key?
              </button>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full mt-2 bg-gradient-to-r from-wine-900 via-wine-800 to-wine-900 hover:from-wine-950 hover:to-wine-900 text-white font-bold shadow-sm"
              isLoading={loading}
              icon={ArrowRight}
            >
              Sign In to {role === 'STUDENT' ? 'Resident Portal' : 'Warden Console'}
            </Button>
          </form>

          {/* Security Guarantee Badge */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted • Role-Isolated Data Access</span>
          </div>

          {/* Student Registration Link */}
          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              New resident at Sakhi Girls Hostel?{' '}
              <Link
                to="/register"
                className="font-bold text-wine-800 hover:text-wine-950 hover:underline"
              >
                Register Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
