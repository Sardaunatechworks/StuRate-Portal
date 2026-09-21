import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminPortalApi } from '../../services/api';
import { AdminDashboardData } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';
import {
  GraduationCap,
  UserCheck,
  Building2,
  BookOpen,
  CheckCircle2,
  Calendar,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminPortalApi
      .getDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading institutional metrics..." />;
  }

  if (error || !data) {
    return (
      <AlertBanner
        type="error"
        title="Dashboard Error"
        message={error || 'Unable to load dashboard data.'}
      />
    );
  }

  const statCards = [
    {
      title: 'Total Students',
      value: data.totalStudents,
      icon: <GraduationCap className="w-5 h-5 text-sky-600" />,
      bg: 'bg-sky-50 text-sky-700',
      link: '/admin/students',
    },
    {
      title: 'Total Lecturers',
      value: data.totalLecturers,
      icon: <UserCheck className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 text-emerald-700',
      link: '/admin/lecturers',
    },
    {
      title: 'Academic Departments',
      value: data.totalDepartments,
      icon: <Building2 className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 text-indigo-700',
      link: '/admin/departments',
    },
    {
      title: 'Active Courses',
      value: data.totalCourses,
      icon: <BookOpen className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 text-amber-700',
      link: '/admin/courses',
    },
    {
      title: 'Evaluations Completed',
      value: data.totalEvaluations,
      icon: <CheckCircle2 className="w-5 h-5 text-teal-600" />,
      bg: 'bg-teal-50 text-teal-700',
      link: '/admin/reports',
    },
    {
      title: 'Institution Average',
      value: data.institutionAverage > 0 ? `${data.institutionAverage} / 5.0` : 'N/A',
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 text-purple-700',
      link: '/admin/reports',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          System Governance Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Institutional overview of academic departments, courses, and student evaluation activity
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, idx) => (
          <Card key={idx} className="hover:border-slate-300 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">
                  {stat.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>{stat.icon}</div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <Link
                to={stat.link}
                className="text-emerald-700 font-medium hover:text-emerald-800 flex items-center gap-1"
              >
                <span>Manage records</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Active Evaluation Period Status */}
      <Card
        title="Evaluation Period Governance"
        subtitle="Manage active evaluation windows for student ratings"
        action={
          <Link
            to="/admin/periods"
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Configure Periods</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        {data.activePeriod ? (
          <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-emerald-950">
                    {data.activePeriod.title}
                  </h4>
                  <Badge variant="success">OPEN</Badge>
                </div>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Academic Session: {data.activePeriod.academicSession} • {data.activePeriod.semester} Semester
                </p>
                <p className="text-[11px] text-emerald-700 mt-1">
                  Students are actively submitting evaluations for courses assigned this semester.
                </p>
              </div>
            </div>
            <Link
              to="/admin/periods"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-700 text-white hover:bg-emerald-800 transition-colors self-start md:self-auto"
            >
              Manage Status
            </Link>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center py-6">
            <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <h4 className="text-sm font-semibold text-slate-800">
              No Evaluation Period is Currently Open
            </h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Students cannot evaluate lecturers while no evaluation window is open. Create or open an evaluation period to begin the rating cycle.
            </p>
            <Link
              to="/admin/periods"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 mt-3 rounded-lg text-xs font-medium bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
            >
              <span>Open Evaluation Window</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};
