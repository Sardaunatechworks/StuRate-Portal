import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useModal } from '../../context/ModalContext';
import API from '../../services/api';
import {
  GraduationCap,
  User,
  Mail,
  Lock,
  Building2,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Award,
  BarChart3,
  Sparkles
} from 'lucide-react';

interface DepartmentOption {
  id: string;
  code: string;
  name: string;
}

const FALLBACK_DEPARTMENTS: DepartmentOption[] = [
  { id: 'csc-fallback', code: 'CSC', name: 'Computer Science' },
  { id: 'cse-fallback', code: 'CSE', name: 'Software Engineering' },
  { id: 'cyb-fallback', code: 'CYB', name: 'Cybersecurity' },
  { id: 'cit-fallback', code: 'CIT', name: 'Information Technology' },
];

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [level, setLevel] = useState<number>(100);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [departments, setDepartments] = useState<DepartmentOption[]>(FALLBACK_DEPARTMENTS);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { signupStudent, isLoading } = useAuth();
  const { showFeedback } = useModal();
  const navigate = useNavigate();

  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    try {
      const res = await API.get('/auth/departments');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setDepartments(res.data);
        setDepartmentId(res.data[0].id);
        setUsingFallback(false);
      } else {
        setDepartments(FALLBACK_DEPARTMENTS);
        setDepartmentId(FALLBACK_DEPARTMENTS[0].id);
        setUsingFallback(true);
      }
    } catch (err: any) {
      console.warn('Failed to load departments from API, using fallback options:', err);
      setDepartments(FALLBACK_DEPARTMENTS);
      setDepartmentId(FALLBACK_DEPARTMENTS[0].id);
      setUsingFallback(true);
    } finally {
      setLoadingDepartments(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      const msg = 'Passwords do not match. Please verify password entries.';
      setErrorMessage(msg);
      showFeedback({
        title: 'Validation Error',
        message: msg,
        type: 'error'
      });
      return;
    }

    if (password.length < 6) {
      const msg = 'Password must be at least 6 characters long.';
      setErrorMessage(msg);
      showFeedback({
        title: 'Validation Error',
        message: msg,
        type: 'error'
      });
      return;
    }

    try {
      const registeredUser = await signupStudent({
        name,
        email,
        studentId,
        departmentId: departmentId || FALLBACK_DEPARTMENTS[0].id,
        level: Number(level),
        password
      });

      showFeedback({
        title: 'Registration Successful!',
        message: `Welcome to the portal, ${registeredUser.name}! Your student account has been created.`,
        type: 'success',
        confirmLabel: 'Go to Student Dashboard',
        onConfirm: () => navigate('/student/dashboard')
      });
    } catch (err: any) {
      const msg = err.message || 'Registration failed. Please verify your details.';
      setErrorMessage(msg);
      showFeedback({
        title: 'Registration Failed',
        message: msg,
        type: 'error'
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-academic-50 dark:bg-[#0C1A12] text-[#1A2E22] dark:text-zinc-100 flex items-center justify-center p-3 sm:p-6 md:p-10 transition-colors duration-200">
      
      {/* Container: Single card on mobile/tablet, Split panel layout on Large screens */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-[#142620] rounded-3xl overflow-hidden shadow-2xl border border-academic-200/80 dark:border-academic-800/60">
        
        {/* Left Side Hero Banner (Visible on lg: screens) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#004225] via-[#003820] to-[#002415] text-white p-10 flex-col justify-between relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Branding */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gold-400 text-academic-950 flex items-center justify-center font-black text-lg shadow-md shrink-0">
                SR
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight text-white leading-none">StuRate Portal</h3>
                <p className="text-[11px] text-academic-300 mt-1">Teacher Effectiveness System</p>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gold-300 text-xs font-semibold backdrop-blur-md border border-white/10">
                <Sparkles size={14} /> Student Registration
              </span>
              <h2 className="text-2xl font-serif font-bold text-white leading-tight">
                Empower Academic Excellence Through Honest Feedback
              </h2>
            </div>
          </div>

          {/* Key Feature Highlights */}
          <div className="relative z-10 space-y-3.5 my-6">
            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <ShieldCheck className="text-emerald-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-xs font-bold text-white">100% Anonymous Ratings</h4>
                <p className="text-[11px] text-academic-300 mt-0.5">Your evaluations are completely detached from your personal student ID.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <Award className="text-gold-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-xs font-bold text-white">Improve Teaching Quality</h4>
                <p className="text-[11px] text-academic-300 mt-0.5">Directly influence course delivery and instructional methodologies.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <BarChart3 className="text-academic-400 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-xs font-bold text-white">Real-Time Evaluation Dashboards</h4>
                <p className="text-[11px] text-academic-300 mt-0.5">Track your pending course evaluations and completion history effortlessly.</p>
              </div>
            </div>
          </div>

          {/* Footer Quote */}
          <div className="relative z-10 pt-4 border-t border-white/10 text-[11px] text-academic-400 flex items-center justify-between">
            <span>Official University Evaluation System</span>
            <span className="font-semibold text-gold-300">2026 Academic Session</span>
          </div>
        </div>

        {/* Right Side Form Container (Mobile & Desktop) */}
        <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6 space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-academic-700 dark:bg-gold-400 text-white dark:text-academic-950 flex items-center justify-center mx-auto shadow-md font-bold text-lg mb-2">
              SR
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1A2E22] dark:text-zinc-100">
              Student Registration
            </h1>
            <p className="text-xs text-[#4A6350] dark:text-academic-400">
              Student Rating Teachers' Effectiveness System
            </p>
          </div>

          {/* Form Header for Desktop */}
          <div className="hidden lg:block mb-6 space-y-1">
            <h1 className="text-2xl font-extrabold text-[#1A2E22] dark:text-zinc-100 tracking-tight">
              Create Your Student Account
            </h1>
            <p className="text-xs text-[#4A6350] dark:text-academic-400">
              Fill in your academic information to register for course evaluations.
            </p>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-xs text-red-600 dark:text-red-300 flex items-start gap-2.5">
              <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-500" />
              <span className="leading-snug">{errorMessage}</span>
            </div>
          )}

          {/* Main Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#1A2E22] dark:text-academic-300 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-3.5 text-[#4A6350] pointer-events-none z-10" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full template-input template-input-has-icon h-11 text-sm"
                    placeholder="e.g. Abubakar Sadiq Ibrahim"
                  />
                </div>
              </div>

              {/* Student Email */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-[#1A2E22] dark:text-academic-300 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 text-[#4A6350] pointer-events-none z-10" size={18} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full template-input template-input-has-icon h-11 text-sm"
                    placeholder="sadiq@student.edu.ng"
                  />
                </div>
              </div>

              {/* Registration / Matric Number */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-[#1A2E22] dark:text-academic-300 mb-1.5">
                  Registration / Matric No. <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <FileText className="absolute left-3.5 text-[#4A6350] pointer-events-none z-10" size={18} />
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full template-input template-input-has-icon h-11 text-sm uppercase"
                    placeholder="e.g. FCP/CSC/23/1001"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="sm:col-span-1">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-[#1A2E22] dark:text-academic-300">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={fetchDepartments}
                    title="Reload Departments"
                    className="text-[11px] text-[#4A6350] hover:text-academic-700 dark:hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <RefreshCw size={11} className={loadingDepartments ? 'animate-spin' : ''} />
                    <span>Refresh</span>
                  </button>
                </div>
                <div className="relative flex items-center">
                  <Building2 className="absolute left-3.5 text-[#4A6350] pointer-events-none z-10" size={18} />
                  <select
                    required
                    value={departmentId}
                    onChange={(e) => setDepartmentId(e.target.value)}
                    className="w-full template-input template-input-has-icon pr-8 h-11 text-sm appearance-none bg-no-repeat cursor-pointer"
                  >
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.code} - {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Academic Level */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-[#1A2E22] dark:text-academic-300 mb-1.5">
                  Academic Level <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full template-input px-3.5 h-11 text-sm cursor-pointer"
                >
                  <option value={100}>100 Level</option>
                  <option value={200}>200 Level</option>
                  <option value={300}>300 Level</option>
                  <option value={400}>400 Level</option>
                  <option value={500}>500 Level</option>
                </select>
              </div>

              {/* Password */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-[#1A2E22] dark:text-academic-300 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-[#4A6350] pointer-events-none z-10" size={18} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full template-input template-input-has-icon template-input-has-right-icon h-11 text-sm"
                    placeholder="Min 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-[#4A6350] hover:text-academic-700 dark:hover:text-zinc-200 z-10 p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="sm:col-span-1">
                <label className="block text-xs font-bold text-[#1A2E22] dark:text-academic-300 mb-1.5">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-[#4A6350] pointer-events-none z-10" size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full template-input template-input-has-icon template-input-has-right-icon h-11 text-sm"
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-[#4A6350] hover:text-academic-700 dark:hover:text-zinc-200 z-10 p-1"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

            </div>

            {/* Password Match Status Banner */}
            {password && confirmPassword && (
              <div className="text-xs pt-1">
                {password === confirmPassword ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={15} /> Passwords match perfectly
                  </span>
                ) : (
                  <span className="text-red-500 font-semibold flex items-center gap-1.5">
                    <AlertCircle size={15} /> Passwords do not match
                  </span>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full template-btn-primary h-12 text-sm flex items-center justify-center gap-2 shadow-lg mt-3"
            >
              {isLoading ? (
                <span>Creating Student Account...</span>
              ) : (
                <>
                  <span>Create Student Account</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer Switch to Login */}
          <div className="mt-6 pt-5 border-t border-academic-200 dark:border-academic-800 text-center space-y-3">
            <p className="text-xs text-[#4A6350] dark:text-academic-400">
              Already have a student account?{' '}
              <Link to="/login" className="font-extrabold text-academic-700 dark:text-gold-400 underline hover:opacity-80">
                Sign In to Portal
              </Link>
            </p>

            <div className="p-3 rounded-2xl bg-academic-50 dark:bg-academic-900/30 text-[11px] text-[#4A6350] dark:text-academic-400 flex items-center gap-2.5">
              <ShieldCheck size={18} className="text-academic-700 dark:text-gold-400 shrink-0" />
              <span className="leading-tight text-left">
                Strictly for <strong>Students</strong>. Administrative and Lecturer access accounts are created by University Admins.
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Signup;
