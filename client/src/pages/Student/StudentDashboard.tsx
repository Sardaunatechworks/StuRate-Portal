import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentEvalApi } from '../../services/api';
import { StudentDashboardData } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';
import { EmptyState } from '../../components/feedback/EmptyState';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = () => {
    setIsLoading(true);
    studentEvalApi
      .getDashboard()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading course evaluation records..." />;
  }

  if (error || !data) {
    return (
      <AlertBanner
        type="error"
        title="Dashboard Error"
        message={error || 'Unable to retrieve student dashboard data.'}
      />
    );
  }

  const completionPercentage =
    data.totalEligible > 0
      ? Math.round((data.completedCount / data.totalEligible) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-800 to-slate-900 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Student Evaluation Portal
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-mono">
              {data.student.matricNumber}
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Academic Teaching Evaluation
          </h1>
          <p className="text-xs text-emerald-100/80 mt-1 max-w-xl">
            Department of {data.student.department} • {data.student.level} Level
          </p>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs text-xs self-start md:self-auto border border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>Your ratings & feedback are 100% anonymous</span>
        </div>
      </div>

      {/* Evaluation Window Banner */}
      {data.activePeriod ? (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-emerald-950 block">
                Active Evaluation Period: {data.activePeriod.title}
              </span>
              <span className="text-emerald-800 text-[11px]">
                {data.activePeriod.academicSession} ({data.activePeriod.semester}{' '}
                Semester)
              </span>
            </div>
          </div>
          <Badge variant="success">OPEN FOR SUBMISSION</Badge>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3 text-xs text-amber-800">
          <Clock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <span className="font-semibold block">
              No Evaluation Period is Currently Active
            </span>
            <span>
              Evaluations are closed until the next evaluation window is opened by the administration.
            </span>
          </div>
        </div>
      )}

      {/* Progress Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Eligible Course Allocations
            </span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-600">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">
            {data.totalEligible}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Courses assigned to your class</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Completed Evaluations
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 mt-2">
            {data.completedCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Submitted anonymously</p>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Pending Evaluations
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-700 mt-2">
            {data.pendingCount}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting your feedback</p>
        </Card>
      </div>

      {/* Progress Bar */}
      {data.totalEligible > 0 && (
        <Card>
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700">
              Evaluation Completion Progress
            </span>
            <span className="font-bold text-emerald-800">
              {data.completedCount} of {data.totalEligible} Completed (
              {completionPercentage}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </Card>
      )}

      {/* Course Evaluation Allocations List */}
      <Card
        title="Courses Assigned for Evaluation"
        subtitle="Submit structured ratings for each lecturer delivering courses this semester"
      >
        {data.evaluations.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-6 h-6" />}
            title="No Course Allocations"
            description="There are currently no lecturers or courses assigned to your department for this academic session."
          />
        ) : (
          <div className="divide-y divide-slate-100">
            {data.evaluations.map((item) => (
              <div
                key={item.assignmentId}
                className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.courseCode}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {item.courseTitle}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600">
                    Lecturer: <span className="font-semibold text-slate-800">{item.lecturerName}</span> • {item.creditUnit} Credit Units
                  </p>
                </div>

                <div>
                  {item.isCompleted ? (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Evaluation Completed</span>
                    </div>
                  ) : data.activePeriod ? (
                    <Link
                      to={`/student/evaluate/${item.assignmentId}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs transition-colors"
                    >
                      <span>Rate Lecturer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <span className="text-xs text-slate-400 italic">
                      Evaluation Window Closed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
