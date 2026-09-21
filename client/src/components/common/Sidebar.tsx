import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  GraduationCap,
  UserCheck,
  Building2,
  BookOpen,
  Link2,
  ListChecks,
  CalendarDays,
  BarChart3,
  User,
  CheckSquare,
  Clock,
  MessageSquareQuote,
  LogOut,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/admin/students', label: 'Students', icon: <GraduationCap className="w-4 h-4" /> },
    { to: '/admin/lecturers', label: 'Lecturers', icon: <UserCheck className="w-4 h-4" /> },
    { to: '/admin/departments', label: 'Departments', icon: <Building2 className="w-4 h-4" /> },
    { to: '/admin/courses', label: 'Courses', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/admin/assignments', label: 'Course Assignments', icon: <Link2 className="w-4 h-4" /> },
    { to: '/admin/questions', label: 'Evaluation Criteria', icon: <ListChecks className="w-4 h-4" /> },
    { to: '/admin/periods', label: 'Evaluation Periods', icon: <CalendarDays className="w-4 h-4" /> },
    { to: '/admin/reports', label: 'Institutional Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/admin/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/student/evaluations', label: 'Course Evaluations', icon: <CheckSquare className="w-4 h-4" /> },
    { to: '/student/history', label: 'Evaluation History', icon: <Clock className="w-4 h-4" /> },
    { to: '/student/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ];

  const lecturerLinks = [
    { to: '/lecturer/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/lecturer/analytics', label: 'Teaching Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { to: '/lecturer/comments', label: 'Anonymous Comments', icon: <MessageSquareQuote className="w-4 h-4" /> },
    { to: '/lecturer/profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
  ];

  const links =
    user.role === 'ADMIN'
      ? adminLinks
      : user.role === 'LECTURER'
      ? lecturerLinks
      : studentLinks;

  const roleVariant =
    user.role === 'ADMIN' ? 'danger' : user.role === 'LECTURER' ? 'primary' : 'info';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800 bg-slate-950/40">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/30">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-white tracking-tight">SRTES</span>
            <span className="block text-[10px] text-slate-400 font-medium tracking-wide uppercase">
              Teacher Evaluation
            </span>
          </div>
        </div>

        {/* User Role Card */}
        <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/20">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-white truncate max-w-[140px]">
              {user.name}
            </span>
            <Badge variant={roleVariant} size="sm">
              {user.role}
            </Badge>
          </div>
          <span className="block text-[11px] text-slate-400 truncate">
            {user.email}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`
              }
            >
              {link.icon}
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Anonymity / Academic Badge */}
        <div className="px-4 py-3 mx-3 my-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Anonymous Student Evaluation Protected</span>
        </div>

        {/* Logout Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-300 hover:bg-rose-950/30 hover:text-rose-200 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};
