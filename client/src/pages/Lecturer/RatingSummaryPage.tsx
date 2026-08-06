import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { RatingStars } from '../../components/RatingStars';
import { Award } from 'lucide-react';

export const RatingSummaryPage: React.FC = () => {
  const [questionStats, setQuestionStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.get('/lecturer/summary')
      .then(res => {
        setQuestionStats(res.data?.questionStats || []);
      })
      .catch(err => {
        console.error('Error fetching rating summary:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Teaching Criteria Rating Summary</h1>
        <p className="text-xs text-zinc-500 mt-1">Detailed rating breakdown across all active teaching effectiveness criteria.</p>
      </div>

      {isLoading ? (
        <p className="text-xs text-zinc-500">Loading rating summary...</p>
      ) : questionStats.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-zinc-500 text-xs border border-zinc-200">
          No rating summary data recorded yet.
        </div>
      ) : (
        <div className="space-y-4">
          {questionStats.map((item, idx) => (
            <div key={item.questionId} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-black text-white text-xs font-bold flex items-center justify-center">
                    #{item.order || idx + 1}
                  </span>
                  <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{item.category}</span>
                </div>
                <h4 className="text-sm font-semibold text-zinc-900">{item.questionText}</h4>
              </div>

              <div className="shrink-0 flex items-center gap-4 bg-zinc-50 px-4 py-3 rounded-xl border border-zinc-200">
                <div className="text-right">
                  <RatingStars value={item.averageRating} readOnly size={18} />
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                    {item.distribution?.[5] || 0} x 5★ • {item.distribution?.[4] || 0} x 4★ ({item.responseCount || 0} votes)
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

