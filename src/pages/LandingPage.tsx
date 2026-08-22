import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  GraduationCap,
  Shield,
  BarChart3,
  Users,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  Star,
  UserCheck,
  LineChart,
  Menu,
  X
} from 'lucide-react';

/* ─── Animated Counter Hook ─── */
function useCountUp(target: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const step = Math.max(1, target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return { count, ref };
}

/* ─── Features Data ─── */
const features = [
  {
    icon: Shield,
    title: 'Anonymous Evaluations',
    desc: 'Student submissions are completely detached from personal identities, ensuring honest and unbiased feedback.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    desc: 'Interactive dashboards with live charts, trends, and comparative metrics for lecturers and administrators.',
  },
  {
    icon: UserCheck,
    title: 'Role-Based Portals',
    desc: 'Dedicated interfaces for Students, Lecturers, and Admins — each with tailored tools and insights.',
  },
];

/* ─── Steps Data ─── */
const steps = [
  {
    step: '01',
    title: 'Register & Enroll',
    desc: 'Students sign up and are automatically linked to their department courses.',
    icon: Users,
  },
  {
    step: '02',
    title: 'Evaluate Lecturers',
    desc: 'Submit anonymous ratings based on structured criteria during evaluation periods.',
    icon: Award,
  },
  {
    step: '03',
    title: 'Gain Insights',
    desc: 'Lecturers and admins review analytics, reports, and actionable feedback in real time.',
    icon: LineChart,
  },
];

/* ─── Quick Access Cards ─── */
const portalCards = [
  {
    title: 'Student Portal',
    desc: 'Evaluate your lecturers, track course assignments, and view your evaluation history.',
    icon: GraduationCap,
    link: '/login',
    color: 'bg-academic-700',
  },
  {
    title: 'Lecturer Portal',
    desc: 'View your ratings, read student feedback, and track performance over time.',
    icon: Award,
    link: '/login',
    color: 'bg-gold-400',
  },
  {
    title: 'Admin Dashboard',
    desc: 'Manage departments, courses, evaluation periods, and generate comprehensive reports.',
    icon: BarChart3,
    link: '/login',
    color: 'bg-academic-900',
  },
  {
    title: 'Evaluation System',
    desc: 'Structured multi-criteria evaluation with configurable questions and rating scales.',
    icon: CheckCircle2,
    link: '/login',
    color: 'bg-accent-orange',
  },
];

export const LandingPage: React.FC = () => {
  const [mobileNav, setMobileNav] = useState(false);
  const [dbStats, setDbStats] = useState({
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0,
    totalEvaluations: 0,
    averageRating: 0
  });

  useEffect(() => {
    API.get('/analytics')
      .then((res) => {
        if (res.data) {
          setDbStats({
            totalStudents: res.data.totalStudents || 0,
            totalLecturers: res.data.totalLecturers || 0,
            totalCourses: res.data.totalCourses || 0,
            totalEvaluations: res.data.totalEvaluations || 0,
            averageRating: res.data.averageRating || 0,
          });
        }
      })
      .catch((err) => {
        console.warn('Unable to load live public analytics, using baseline values:', err);
      });
  }, []);

  const statsList = [
    { label: 'Registered Students', value: dbStats.totalStudents || 1200, suffix: '+', icon: Users },
    { label: 'Courses Evaluated', value: dbStats.totalCourses || 45, suffix: '+', icon: BookOpen },
    { label: 'Active Lecturers', value: dbStats.totalLecturers || 28, suffix: '+', icon: GraduationCap },
    { label: 'Satisfaction Rate', value: dbStats.averageRating ? Math.round((dbStats.averageRating / 5) * 100) : 96, suffix: '%', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-white text-[#1A2E22] font-sans overflow-x-hidden">

    
      {/* ═══════════════════════════ NAVIGATION ═══════════════════════════ */}
      <nav className="bg-white border-b border-academic-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-academic-700 text-white flex items-center justify-center font-black text-sm shadow-md">
              SR
            </div>
            <div>
              <h1 className="font-extrabold text-academic-700 text-base leading-none tracking-tight">StuRate Portal</h1>
              <p className="text-[10px] text-academic-500 font-medium uppercase tracking-wider">Student Rating System</p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#4A6350]">
            <a href="#features" className="hover:text-academic-700 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-academic-700 transition-colors">How It Works</a>
            <a href="#stats" className="hover:text-academic-700 transition-colors">Statistics</a>
            <a href="#contact" className="hover:text-academic-700 transition-colors">Contact</a>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-academic-700 hover:text-academic-800 transition-colors px-3 py-2">
              Sign In
            </Link>
            <Link to="/signup" className="template-btn-orange flex items-center gap-1.5 !py-2.5 !px-5 !text-sm !rounded-full">
              Get Started <ArrowRight size={15} />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileNav(!mobileNav)} className="md:hidden p-2 text-academic-700">
            {mobileNav ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileNav && (
          <div className="md:hidden bg-white border-t border-academic-100 px-4 py-4 space-y-3 animate-fade-in">
            <a href="#features" onClick={() => setMobileNav(false)} className="block text-sm font-medium text-[#4A6350] hover:text-academic-700 py-2">Features</a>
            <a href="#how-it-works" onClick={() => setMobileNav(false)} className="block text-sm font-medium text-[#4A6350] hover:text-academic-700 py-2">How It Works</a>
            <a href="#stats" onClick={() => setMobileNav(false)} className="block text-sm font-medium text-[#4A6350] hover:text-academic-700 py-2">Statistics</a>
            <a href="#contact" onClick={() => setMobileNav(false)} className="block text-sm font-medium text-[#4A6350] hover:text-academic-700 py-2">Contact</a>
            <div className="pt-3 border-t border-academic-100 flex flex-col gap-2">
              <Link to="/login" className="text-center text-sm font-semibold text-academic-700 py-2.5 border border-academic-300 rounded-xl">Sign In</Link>
              <Link to="/signup" className="template-btn-orange text-center !rounded-xl">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════ HERO SECTION ═══════════════════════════ */}
      <section className="relative bg-gradient-to-br from-[#004225] via-[#003820] to-[#002415] text-white overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-academic-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 md:py-36 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md text-gold-300 text-xs sm:text-sm font-semibold tracking-widest uppercase mb-8 animate-fade-in">
            Knowledge · Excellence · Service
          </div>

          {/* Main Heading */}
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            Empowering Academic Excellence Through{' '}
            <span className="text-gold-400">Student Feedback</span>
          </h2>

          {/* Divider */}
          <div className="w-20 h-1 bg-gold-400 mx-auto mt-8 mb-6 rounded-full" />

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            StuRate Portal provides a secure, anonymous evaluation platform where students rate teaching effectiveness —
            driving continuous improvement in academic quality.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-fade-in-up" style={{ animationDelay: '0.45s' }}>
            <Link to="/signup" className="template-btn-orange !py-3.5 !px-8 !text-base !rounded-full flex items-center gap-2 shadow-lg shadow-orange-500/20">
              Get Started <ArrowRight size={18} />
            </Link>
            <a href="#features" className="template-btn-outline-white !py-3.5 !px-8 !text-base !rounded-full">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ QUICK ACCESS PORTAL CARDS ═══════════════════════════ */}
      <section className="bg-academic-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-accent-orange mb-3">Quick Access</p>
          <h3 className="font-serif text-3xl sm:text-4xl font-bold text-academic-900 mb-3">
            Portal Hub & Essential Services
          </h3>
          <p className="text-sm text-[#4A6350] max-w-xl mb-10">
            Access your dedicated portal with tailored tools, evaluations, analytics, and administrative features.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {portalCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  to={card.link}
                  className="group bg-white border border-academic-200/60 rounded-2xl p-6 hover:shadow-lg hover:border-academic-300 transition-all duration-300 relative overflow-hidden"
                >
                  {/* Icon Container */}
                  <div className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={22} />
                  </div>
                  <h4 className="text-base font-bold text-academic-700 mb-2">{card.title}</h4>
                  <p className="text-xs text-[#4A6350] leading-relaxed">{card.desc}</p>
                  <ChevronRight size={18} className="absolute bottom-6 right-6 text-academic-300 group-hover:text-academic-600 group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ STATS SECTION ═══════════════════════════ */}
      <section id="stats" className="template-section-green text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-gold-300 mb-10">
            Institutional Evaluation Metrics
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {statsList.map((stat, idx) => {
              const { count, ref } = useCountUp(stat.value, 2000);
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  ref={ref}
                  className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center hover:bg-white/15 transition-all duration-300"
                >
                  <div className="w-1 h-8 bg-gold-400 mx-auto mb-4 rounded-full" />
                  <Icon size={28} className="mx-auto text-gold-300 mb-3" />
                  <p className="font-serif text-3xl sm:text-4xl font-bold text-gold-400">
                    {count.toLocaleString()}{stat.suffix}
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-white mt-2">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FEATURES SECTION ═══════════════════════════ */}
      <section id="features" className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-orange mb-3">Why StuRate?</p>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-academic-900 mb-3">
              Built for Academic Excellence
            </h3>
            <p className="text-sm text-[#4A6350] max-w-xl mx-auto">
              A modern evaluation platform designed to transform student feedback into actionable insights for better teaching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="bg-academic-50 border border-academic-200/50 rounded-2xl p-8 hover:shadow-lg hover:border-academic-300 transition-all duration-300 group">
                  <div className="w-14 h-14 rounded-2xl bg-academic-700 text-white flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={26} />
                  </div>
                  <h4 className="text-lg font-bold text-academic-900 mb-3">{feat.title}</h4>
                  <p className="text-sm text-[#4A6350] leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ HOW IT WORKS ═══════════════════════════ */}
      <section id="how-it-works" className="bg-academic-50 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-accent-orange mb-3">How It Works</p>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-academic-900 mb-3">
              Three Simple Steps
            </h3>
            <p className="text-sm text-[#4A6350] max-w-xl mx-auto">
              From registration to actionable insights — the evaluation process is streamlined and intuitive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="relative bg-white border border-academic-200/60 rounded-2xl p-8 text-center hover:shadow-lg transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gold-400 text-academic-950 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black shadow-md">
                    {s.step}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-academic-100 text-academic-700 flex items-center justify-center mx-auto mb-5 mt-3">
                    <Icon size={26} />
                  </div>
                  <h4 className="text-lg font-bold text-academic-900 mb-3">{s.title}</h4>
                  <p className="text-sm text-[#4A6350] leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ CTA BANNER ═══════════════════════════ */}
      <section className="template-section-green text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h3 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
            Ready to Improve Teaching Quality?
          </h3>
          <p className="text-base text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
            Join students and lecturers using StuRate Portal to drive academic excellence through transparent, anonymous feedback.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="template-btn-orange !py-3.5 !px-8 !text-base !rounded-full flex items-center gap-2 shadow-lg shadow-orange-500/20">
              Create Account <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="template-btn-outline-white !py-3.5 !px-8 !text-base !rounded-full">
              Sign In to Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FOOTER ═══════════════════════════ */}
      <footer id="contact" className="bg-academic-900 text-white pt-16 pb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">

            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold-400 text-academic-950 flex items-center justify-center font-black text-sm shadow-md">
                  SR
                </div>
                <div>
                  <h4 className="font-extrabold text-white text-base leading-none">StuRate Portal</h4>
                  <p className="text-[10px] text-academic-300 uppercase tracking-wider">Student Rating System</p>
                </div>
              </div>
              <div className="w-10 h-0.5 bg-gold-400 rounded-full mb-4" />
              <p className="text-sm text-academic-300 leading-relaxed max-w-xs">
                A comprehensive student evaluation platform committed to excellence in teaching assessment, feedback analysis, and academic quality improvement.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h5 className="font-bold text-white text-sm mb-4">Quick Links</h5>
              <div className="w-8 h-0.5 bg-gold-400 rounded-full mb-4" />
              <ul className="space-y-2.5 text-sm text-academic-300">
                <li><Link to="/login" className="hover:text-white transition-colors">Student Portal</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Staff Portal</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h5 className="font-bold text-white text-sm mb-4">Resources</h5>
              <div className="w-8 h-0.5 bg-gold-400 rounded-full mb-4" />
              <ul className="space-y-2.5 text-sm text-academic-300">
                <li><a href="#" className="hover:text-white transition-colors">Evaluation Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Rating Criteria</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h5 className="font-bold text-white text-sm mb-4">Contact</h5>
              <div className="w-8 h-0.5 bg-gold-400 rounded-full mb-4" />
              <ul className="space-y-3 text-sm text-academic-300">
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="shrink-0 mt-0.5 text-gold-400" />
                  <span>Dutse, Jigawa State, Nigeria</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail size={15} className="shrink-0 text-gold-400" />
                  <span>info@sturate.edu.ng</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-academic-400">
            <p>© {new Date().getFullYear()} StuRate Portal. All rights reserved.</p>
            <div className="flex items-center gap-4 mt-3 sm:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span className="text-academic-700">·</span>
              <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
              <span className="text-academic-700">·</span>
              <a href="#" className="hover:text-white transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
