import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { studentEvalApi } from '../../services/api';
import { EvaluationHistoryItem } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';

export const EvaluationHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<EvaluationHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    studentEvalApi
      .getHistory()
      .then(setHistory)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          My Evaluation History
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Read-only record of academic evaluations submitted by your student account
        </p>
      </div>

      {error && (
        <AlertBanner
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <Card>
        {isLoading ? (
          <LoadingSpinner message="Fetching your evaluation history..." />
        ) : (!history || history.length === 0) ? (
          <EmptyState
            icon={<Clock className="w-6 h-6" />}
            title="No Past Evaluations"
            description="You have not submitted any lecturer evaluations yet."
            actionLabel="View Dashboard"
            onAction={() => window.location.assign('/student/dashboard')}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Lecturer</th>
                  <th className="py-3 px-4">Academic Session</th>
                  <th className="py-3 px-4">Submission Date</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-emerald-800">
                        {item.courseCode}
                      </div>
                      <div className="text-slate-600 text-[11px]">
                        {item.courseTitle}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {item.lecturerName}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {item.academicSession} ({item.semester} Semester)
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-[11px]">
                      {new Date(item.submittedAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Submitted</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
