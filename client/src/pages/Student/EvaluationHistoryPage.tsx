import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { History, CheckCircle2, Calendar } from 'lucide-react';

export const EvaluationHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.get('/student/evaluations/history')
      .then(res => {
        setHistory(res.data || []);
      })
      .catch(err => {
        console.error('Error fetching evaluation history:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Evaluation History</h1>
        <p className="text-xs text-zinc-500 mt-1">Confidential record of submitted teacher evaluation forms.</p>
      </div>

      {isLoading ? (
        <p className="text-xs text-zinc-500">Loading evaluation history...</p>
      ) : history.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-zinc-500 text-xs border border-zinc-200">
          No evaluation history found.
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((h) => (
            <div key={h.id} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-xl bg-zinc-100 text-zinc-900 font-mono font-bold text-xs border border-zinc-200">
                    {h.courseCode}
                  </span>
                  <h3 className="text-base font-extrabold text-zinc-900">{h.courseTitle}</h3>
                </div>
                <p className="text-xs text-zinc-600 mt-2">Lecturer: <strong>{h.lecturerName}</strong></p>
                <div className="mt-2 flex items-center gap-3 text-xs text-zinc-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{h.periodTitle}</span>
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="px-3 py-1.5 rounded-xl bg-zinc-100 text-zinc-900 font-semibold border border-zinc-200 text-xs inline-flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>Submitted Confidential (Avg: {h.averageRating}★)</span>
                </span>
                <p className="text-xs text-zinc-500 mt-2 font-mono">Date: {formatDate(h.submittedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

