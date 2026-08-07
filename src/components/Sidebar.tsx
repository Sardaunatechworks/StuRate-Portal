import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSidebar } from '../context/SidebarContext';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  UserCheck,
  HelpCircle,
  Clock,
  FileBarChart,
  PieChart,
  LogOut,
  Award,
  BookMarked,
  History,
  MessageSquare,
  User,
  X
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { isMobileOpen, closeMobileSidebar } = useSidebar();

  if (!user) return null;

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/students', label: 'Students', icon: Users },
    { to: '/admin/lecturers', label: 'Lecturers', icon: GraduationCap },
    { to: '/admin/departments', label: 'Departments', icon: Building2 },
    { to: '/admin/courses', label: 'Courses', icon: BookOpen },
    { to: '/admin/assignments', label: 'Assignments', icon: UserCheck },
    { to: '/admin/questions', label: 'Criteria Questions', icon: HelpCircle },
    { to: '/admin/evaluation-period', label: 'Evaluation Session', icon: Clock },
    { to: '/admin/reports', label: 'Reports', icon: FileBarChart },
    { to: '/admin/analytics', label: 'Analytics', icon: PieChart },
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/courses', label: 'My Enrolled Courses', icon: BookMarked },
    { to: '/student/history', label: 'Evaluation History', icon: History },
    { to: '/student/profile', label: 'My Profile', icon: User },
  ];

  const lecturerLinks = [
    { to: '/lecturer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/lecturer/summary', label: 'Rating Summary', icon: Award },
    { to: '/lecturer/comments', label: 'Student Feedback', icon: MessageSquare },
    { to: '/lecturer/analytics', label: 'Performance Stats', icon: PieChart },
    { to: '/lecturer/profile', label: 'My Profile', icon: User },
  ];

  const links = user.role === 'ADMIN' ? adminLinks : user.role === 'STUDENT' ? studentLinks : lecturerLinks;

  const navContent = (
    <>
      <div>
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center -space-x-1">
              <div className="w-5 h-5 rounded-full bg-white" />
              <div className="w-5 h-5 rounded-full bg-white opacity-80" />
            </div>
            <h1 className="font-extrabold text-white text-lg tracking-tight">Learning</h1>
          </div>
          {/* Close button for mobile drawer */}
          <button
            onClick={closeMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-2 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-zinc-900 text-white font-bold'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                  }`
                }
              >
                <Icon size={18} className="shrink-0" />
                <span className="truncate">{link.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout Button */}
      <div className="p-4 border-t border-zinc-900">
        <div className="p-3 bg-zinc-900/80 rounded-xl flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-zinc-400 font-mono capitalize">{user.role.toLowerCase()}</p>
          </div>
          <button
            onClick={() => {
              closeMobileSidebar();
              logout();
            }}
            title="Logout"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile, visible md+) */}
      <aside className="w-64 bg-black text-white flex flex-col justify-between hidden md:flex min-h-screen shrink-0 border-r border-zinc-900">
        {navContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Mobile Sidebar Slide-over Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-black text-white flex flex-col justify-between shadow-2xl transition-transform duration-300 transform md:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>
    </>
  );
};
