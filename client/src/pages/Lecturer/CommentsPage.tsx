import React, { useEffect, useState } from 'react';
import { lecturerPortalApi } from '../../services/api';
import { LecturerCommentItem } from '../../types';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { MessageSquareQuote, ShieldCheck, User } from 'lucide-react';

export const CommentsPage: React.FC = () => {
  const [comments, setComments] = useState<LecturerCommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lecturerPortalApi
      .getComments()
      .then(setComments)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading qualitative student feedback..." />;
  }

  if (error) {
    return (
      <AlertBanner
        type="error"
        title="Feedback Retrieval Error"
        message={error}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Student Feedback & Observations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Qualitative observations provided by students enrolled in your evaluated courses
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Anonymized Stream</span>
        </div>
      </div>

      {comments.length === 0 ? (
        <EmptyState
          icon={<MessageSquareQuote className="w-6 h-6" />}
          title="No Student Comments"
          description="Students enrolled in your courses have not left qualitative text observations yet."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {comments.map((item) => (
            <Card key={item.id} className="hover:border-slate-300 transition-colors">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Anonymous Student
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(item.submittedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                <span className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {item.courseCode}
                </span>
              </div>

              <blockquote className="text-xs text-slate-700 italic border-l-2 border-emerald-500 pl-3 py-1 bg-slate-50/50 rounded-r-lg">
                “{item.comment}”
              </blockquote>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="truncate max-w-[220px]">{item.courseTitle}</span>
                <span>{item.session}</span>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
