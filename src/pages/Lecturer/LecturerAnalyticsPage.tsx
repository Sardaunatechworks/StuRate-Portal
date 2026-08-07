import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const LecturerAnalyticsPage: React.FC = () => {
  const [criteriaData, setCriteriaData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.get('/lecturer/summary')
      .then(res => {
        const stats = res.data?.questionStats || [];
        const formatted = stats.map((item: any, idx: number) => ({
          category: item.category ? `${item.category} (#${idx + 1})` : `Criterion ${idx + 1}`,
          score: item.averageRating || 0
        }));
        setCriteriaData(formatted);
      })
      .catch(err => {
        console.error('Error fetching lecturer analytics:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Teaching Performance Analytics</h1>
        <p className="text-xs text-zinc-500 mt-1">Graphical representation of your evaluation scores across pedagogical dimensions.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
          <BarChart3 className="text-black" size={18} />
          <span>Score Breakdown per Metric (Out of 5.0)</span>
        </h3>
        <div className="h-80 w-full pt-4">
          {isLoading ? (
            <div className="h-full flex items-center justify-center text-xs text-zinc-400">Loading performance data...</div>
          ) : criteriaData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-zinc-400">No evaluation data recorded yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={criteriaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="category" stroke="#71717a" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 5]} stroke="#71717a" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '12px', color: '#000000' }} />
                <Bar dataKey="score" fill="#000000" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

