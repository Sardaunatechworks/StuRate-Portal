import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { BarChart3, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [ratingDistributionData, setRatingDistributionData] = useState<any[]>([]);
  const [departmentComparison, setDepartmentComparison] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/analytics'),
      API.get('/reports/departments')
    ]).then(([analyticsRes, deptsRes]) => {
      const dist = analyticsRes.data.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      setRatingDistributionData([
        { star: '5 Stars', count: dist[5] || 0, fill: '#000000' },
        { star: '4 Stars', count: dist[4] || 0, fill: '#27272a' },
        { star: '3 Stars', count: dist[3] || 0, fill: '#52525b' },
        { star: '2 Stars', count: dist[2] || 0, fill: '#a1a1aa' },
        { star: '1 Star', count: dist[1] || 0, fill: '#e4e4e7' },
      ]);

      const deptData = deptsRes.data.map((d: any) => ({
        name: d.code || d.name,
        score: d.averageRating || 0
      }));
      setDepartmentComparison(deptData);
    }).catch(err => {
      console.error('Error fetching analytics page data:', err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Analytics Dashboard</h1>
        <p className="text-xs text-zinc-500 mt-1">Graphical visualizations of teaching rating distributions and department averages.</p>
      </div>

      {isLoading ? (
        <p className="text-xs text-zinc-500">Loading analytics...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rating Distribution Bar Chart */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
              <BarChart3 className="text-black" size={18} />
              <span>Score Distribution (1 - 5 Scale)</span>
            </h3>
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ratingDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="star" stroke="#71717a" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#71717a" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '12px', color: '#000000' }} />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {ratingDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Department Comparison Chart */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
              <TrendingUp className="text-black" size={18} />
              <span>Department Rating Averages</span>
            </h3>
            <div className="h-72 w-full pt-4">
              {departmentComparison.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-zinc-400">
                  No department ratings recorded yet.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={departmentComparison} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis type="number" domain={[0, 5]} stroke="#71717a" tick={{ fontSize: 12 }} />
                    <YAxis dataKey="name" type="category" stroke="#71717a" tick={{ fontSize: 12 }} width={120} />
                    <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e4e4e7', borderRadius: '12px', color: '#000000' }} />
                    <Bar dataKey="score" fill="#000000" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

