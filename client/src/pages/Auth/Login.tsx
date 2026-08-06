import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import {
  Lock,
  User,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Award,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

export const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { login, isLoading } = useAuth();
  const { showFeedback } = useModal();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      const loggedUser = await login(identifier, password);
      const targetPath = loggedUser.role === 'ADMIN'
        ? '/admin/dashboard'
        : loggedUser.role === 'STUDENT'
        ? '/student/dashboard'
        : '/lecturer/dashboard';

      showFeedback({
        title: 'Login Successful',
        message: `Welcome back, ${loggedUser.name}! Directing you to your ${loggedUser.role.toLowerCase()} dashboard.`,
        type: 'success',
        confirmLabel: 'Proceed to Dashboard',
        onConfirm: () => navigate(targetPath)
      });
    } catch (err: any) {
      const msg = err.message || 'Login failed. Please verify credentials.';
      setErrorMessage(msg);
      showFeedback({
        title: 'Authentication Failed',
        message: msg,
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-100 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-3 sm:p-6 md:p-10 transition-colors duration-200">
      
      {/* Main Container: Split screen on lg: desktop, single card on mobile/tablet */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/80 dark:border-zinc-800/80">
        
        {/* Left Hero Banner (Desktop lg: screen) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black text-white p-10 flex-col justify-between relative overflow-hidden">
          
          {/* Glowing Accents */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Logo & Title */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white text-black flex items-center justify-center font-black text-lg shadow-md shrink-0">
                SR
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-white leading-none">StuRate Portal</h3>
                <p className="text-[11px] text-zinc-400 mt-1">Teacher Effectiveness System</p>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-semibold backdrop-blur-md border border-white/10">
                <Sparkles size={14} /> Unified Access Portal
              </span>
              <h2 className="text-2xl font-black text-white leading-tight">
                Secure Academic Portal Sign In
              </h2>
            </div>
          </div>

          {/* Highlights */}
          <div className="relative z-10 space-y-3.5 my-6">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-xs font-bold text-white">Role-Based Dashboard Access</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Students, Lecturers, and Admins automatically route to their custom portal.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Award className="text-blue-400 shrink-0 mt-0.5" size={18} />
              <div>
                <h4 className="text-xs font-bold text-white">Anonymous Evaluations</h4>
                <p className="text-[11px] text-zinc-400 mt-0.5">Student submissions remain completely unlinked from user identities.</p>
              </div>
            </div>
          </div>

          {/* Footer info */}
          <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Student Rating System</span>
            <span className="font-semibold text-zinc-300">v2.4 Portal</span>
          </div>
        </div>

        {/* Right Side Form Panel (Mobile & Desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          
          {/* Header Mobile */}
          <div className="lg:hidden text-center mb-6 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mx-auto shadow-md font-bold text-lg mb-2">
              SR
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-zinc-900 dark:text-zinc-100">
              Sign In to Portal
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Student Rating Teachers' Effectiveness System
            </p>
          </div>

          {/* Header Desktop */}
          <div className="hidden lg:block mb-6 space-y-1">
            <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Enter your credentials to access your portal dashboard.
            </p>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-xs text-red-600 dark:text-red-300 flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Registration No. / Staff ID / Email
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 text-zinc-400 pointer-events-none z-10" size={18} />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full template-input template-input-has-icon h-11 text-sm"
                  placeholder="e.g. FCP/CSC/23/1001 or email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 text-zinc-400 pointer-events-none z-10" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full template-input template-input-has-icon template-input-has-right-icon h-11 text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 z-10 p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full template-btn-black h-12 text-sm flex items-center justify-center gap-2 shadow-lg mt-2"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Student Signup Callout Box */}
          <div className="mt-6 p-4 rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
            <div className="flex items-center gap-2.5">
              <GraduationCap size={22} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <div>
                <p className="font-bold text-zinc-900 dark:text-zinc-100">New Student?</p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Register to evaluate your courses.</p>
              </div>
            </div>
            <Link
              to="/signup"
              className="font-bold bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm shrink-0"
            >
              Sign Up
            </Link>
          </div>

          {/* Footer Info */}
          <div className="mt-4 p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2.5">
            <ShieldCheck size={18} className="text-black dark:text-white shrink-0" />
            <span className="leading-snug text-[11px]">
              <strong>Students:</strong> Sign in with Registration Number. <br />
              <strong>Staff/Admin:</strong> Sign in with Staff ID or Email.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;
