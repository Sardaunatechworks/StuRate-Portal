import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { BookMarked, CheckCircle2, Clock, Sparkles, ArrowRight, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/student/dashboard'),
      API.get('/student/courses')
    ]).then(([dashRes, coursesRes]) => {
      setDashboardData(dashRes.data);
      setCourses(coursesRes.data?.courses || []);
    }).catch(err => {
      console.error('Error fetching student dashboard:', err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const totalAssigned = dashboardData?.totalAssignedCourses || courses.length;
  const pendingCount = dashboardData?.pendingEvaluations ?? courses.filter(c => !c.isEvaluated).length;
  const completedCount = dashboardData?.completedEvaluations ?? courses.filter(c => c.isEvaluated).length;
  const activeSessionTitle = dashboardData?.activePeriod?.academicSession || 'Active';

  const templateCards = [
    { title: 'Total Enrolled Courses', count: totalAssigned.toString(), icon: BookMarked },
    { title: 'Pending Evaluations', count: pendingCount.toString(), icon: Clock },
    { title: 'Completed Evaluations', count: completedCount.toString(), icon: CheckCircle2 },
    { title: 'Active Session', count: activeSessionTitle, icon: Sparkles },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Student Dashboard</h1>
        <p className="text-xs text-zinc-500 mt-1">Welcome back, {user?.name}. Evaluate your assigned lecturers for active terms.</p>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {templateCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
              <Icon size={32} className="text-zinc-900 stroke-[1.5] mb-4" />
              <p className="text-xs font-medium text-zinc-500">{card.title}</p>
              <h3 className="text-2xl font-extrabold text-zinc-900 mt-1">{card.count}</h3>
            </div>
          );
        })}
      </div>

      {/* Assigned Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-900">Assigned Courses & Lecturers</h2>
          <Link to="/student/courses" className="text-xs font-semibold text-zinc-500 hover:text-black">
            View All
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-zinc-200/80 shadow-sm space-y-3">
          {isLoading ? (
            <p className="text-xs text-zinc-500 p-4">Loading assigned courses...</p>
          ) : courses.length === 0 ? (
            <p className="text-xs text-zinc-500 p-4">No enrolled courses assigned for evaluation yet.</p>
          ) : (
            courses.map((c) => (
              <div key={c.courseAssignmentId} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/60 flex items-center justify-between hover:bg-zinc-100/80 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900">{c.courseCode}</h4>
                    <p className="text-xs text-zinc-500">{c.courseTitle} • Lecturer: {c.lecturerName}</p>
                  </div>
                </div>

                {c.isEvaluated ? (
                  <span className="px-3 py-1.5 rounded-xl bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1.5">
                    <CheckCircle2 size={14} />
                    <span>Submitted</span>
                  </span>
                ) : (
                  <Link
                    to={`/student/evaluate/${c.courseAssignmentId}`}
                    className="bg-black text-white hover:bg-zinc-800 font-semibold rounded-xl px-4 py-2 text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <span>Evaluate</span>
                    <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

