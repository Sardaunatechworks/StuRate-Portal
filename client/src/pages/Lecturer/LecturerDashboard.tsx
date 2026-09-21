import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { lecturerPortalApi } from '../../services/api';
import { LecturerDashboardData } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';
import {
  Star,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  MessageSquareQuote,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const LecturerDashboard: React.FC = () => {
  const [data, setData] = useState<LecturerDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lecturerPortalApi
      .getDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading lecturer teaching performance summary..." />;
  }

  if (error || !data) {
    return (
      <AlertBanner
        type="error"
        title="Dashboard Error"
        message={error || 'Unable to load lecturer dashboard.'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-slate-900 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Lecturer Teaching Portal
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-mono">
              {data.lecturer.staffId}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome, {data.lecturer.name}
          </h1>
          <p className="text-xs text-emerald-100/80 mt-1">
            Department of {data.lecturer.department}
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs text-xs self-start md:self-auto border border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>Student identities are completely anonymized</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Overall Average Score
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            </div>
          </div>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-3xl font-bold text-slate-900">
              {data.overallAverage > 0 ? data.overallAverage.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-slate-400">/ 5.00</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Aggregated across all criteria</p>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Evaluations Received
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-emerald-700 mt-2">
            {data.totalEvaluations}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Total student submissions</p>
        </Card>

        <Card className="hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Courses Evaluated
            </span>
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {data.coursesEvaluatedCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Different course offerings</p>
        </Card>
      </div>

      {/* Quick Action Navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          title="Teaching Analytics & Performance"
          subtitle="View 9-criteria breakdown, charts, and rating distributions"
        >
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Inspect graphical charts comparing your scores across Subject Knowledge, Teaching Method, Punctuality, Fairness in Assessment, and overall satisfaction.
          </p>
          <Link
            to="/lecturer/analytics"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors"
          >
            <span>Explore Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Card>

        <Card
          title="Anonymous Student Feedback"
          subtitle="Qualitative student comments and constructive observations"
        >
          <p className="text-xs text-slate-600 leading-relaxed mb-4">
            Read comments left by students enrolled in your evaluated courses, delivered with full confidentiality guarantees.
          </p>
          <Link
            to="/lecturer/comments"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors"
          >
            <span>Read Comments</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Card>
      </div>
    </div>
  );
};
