import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { RatingStars } from '../../components/RatingStars';
import { Award, FileCheck2, MessageSquare, BookOpen, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LecturerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.get('/lecturer/dashboard')
      .then(res => {
        setData(res.data);
      })
      .catch(err => {
        console.error('Error fetching lecturer dashboard:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const overallAvg = data?.overallAverageRating || 0;
  const totalEval = data?.totalEvaluations || 0;
  const assignedCount = data?.assignedCoursesCount || 0;
  const courseBreakdown = data?.courseBreakdown || [];
  const recentComments = data?.recentComments || [];

  const templateCards = [
    { title: 'Overall Score', count: overallAvg ? `${overallAvg} / 5.0` : 'N/A', icon: Award },
    { title: 'Total Evaluations', count: totalEval.toString(), icon: FileCheck2 },
    { title: 'Assigned Courses', count: assignedCount.toString(), icon: BookOpen },
    { title: 'Lecturer Staff ID', count: data?.lecturer?.staffId || 'N/A', icon: FileText },
  ];

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Lecturer Dashboard</h1>
        <p className="text-xs text-zinc-500 mt-1">Welcome back, <strong>{user?.name}</strong>. Monitor your student evaluation metrics and feedback.</p>
      </div>

      {isLoading ? (
        <p className="text-xs text-zinc-500">Loading lecturer metrics...</p>
      ) : (
        <>
          {/* 4 Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {templateCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow">
                  <Icon size={32} className="text-zinc-900 stroke-[1.5] mb-4" />
                  <p className="text-xs font-medium text-zinc-500">{card.title}</p>
                  <h3 className="text-2xl font-extrabold text-zinc-900 mt-1 truncate">{card.count}</h3>
                </div>
              );
            })}
          </div>

          {/* Course Ratings & Recent Anonymous Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Ratings Breakdown */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                <Award className="text-black" size={18} />
                <span>Ratings Breakdown by Course</span>
              </h3>
              <div className="space-y-3">
                {courseBreakdown.length === 0 ? (
                  <p className="text-xs text-zinc-400">No course ratings available.</p>
                ) : (
                  courseBreakdown.map((c: any, i: number) => (
                    <div key={i} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/60 flex items-center justify-between">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full bg-zinc-200 text-zinc-900 text-[11px] font-mono font-bold">
                          {c.courseCode}
                        </span>
                        <h4 className="text-sm font-bold text-zinc-900 mt-1">{c.courseTitle}</h4>
                        <p className="text-xs text-zinc-500">{c.evaluationCount} student responses</p>
                      </div>
                      <RatingStars value={c.averageRating} readOnly size={16} />
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recent Anonymous Student Feedback */}
            <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
                  <MessageSquare className="text-black" size={18} />
                  <span>Recent Anonymous Feedback</span>
                </h3>
                <Link to="/lecturer/comments" className="text-xs font-semibold text-zinc-500 hover:text-black">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {recentComments.length === 0 ? (
                  <p className="text-xs text-zinc-400">No comments submitted yet.</p>
                ) : (
                  recentComments.map((comment: any) => (
                    <div key={comment.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/60 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-black">{comment.courseCode}</span>
                        <span className="text-zinc-500 font-mono">{formatDate(comment.date)}</span>
                      </div>
                      <p className="text-xs text-zinc-700 italic leading-relaxed">"{comment.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

