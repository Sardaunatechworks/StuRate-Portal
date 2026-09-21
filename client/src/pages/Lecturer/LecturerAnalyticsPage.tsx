import React, { useEffect, useState } from 'react';
import { lecturerPortalApi } from '../../services/api';
import { LecturerAnalyticsData } from '../../types';
import { Card } from '../../components/common/Card';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';
import { EmptyState } from '../../components/feedback/EmptyState';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { BarChart3, Star, TrendingUp } from 'lucide-react';

export const LecturerAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<LecturerAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    lecturerPortalApi
      .getAnalytics()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Calculating teaching performance analytics..." />;
  }

  if (error || !data) {
    return (
      <AlertBanner
        type="error"
        title="Analytics Error"
        message={error || 'Unable to load analytics data.'}
      />
    );
  }

  if (data.totalEvaluations === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Teaching Analytics & Effectiveness Breakdown
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluation metrics across all 9 approved academic teaching criteria
          </p>
        </div>
        <EmptyState
          icon={<BarChart3 className="w-6 h-6" />}
          title="No Evaluation Data Available Yet"
          description="Your students have not submitted evaluations for your assigned courses yet. Once evaluations are submitted, graphical rating distributions and criteria scores will appear here."
        />
      </div>
    );
  }

  const distributionColors = ['#f43f5e', '#fb923c', '#facc15', '#38bdf8', '#10b981'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Teaching Analytics & Effectiveness Breakdown
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Comprehensive breakdown of student evaluations across all 9 academic criteria
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs font-semibold">
          <Star className="w-4 h-4 fill-emerald-600 text-emerald-600" />
          <span>Overall: {data.overallAverage.toFixed(2)} / 5.0</span>
        </div>
      </div>

      {/* Criteria Averages Chart */}
      <Card
        title="Average Score per Evaluation Criterion (1 to 5 Scale)"
        subtitle="Performance breakdown across the 9 approved university teaching criteria"
      >
        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.criteriaAverages}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
              <XAxis
                type="number"
                domain={[0, 5]}
                ticks={[1, 2, 3, 4, 5]}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                type="category"
                dataKey="criterion"
                tick={{ fontSize: 11, fill: '#334155' }}
                width={120}
              />
              <Tooltip
                formatter={(value: any) => [`${value} / 5.0`, 'Average Score']}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  color: '#fff',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="average" fill="#047857" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Grid: Rating Distribution & Course Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rating Distribution Histogram */}
        <Card
          title="Rating Distribution"
          subtitle="Frequency distribution of individual criteria score responses"
        >
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.ratingDistribution}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis
                  dataKey="rating"
                  tickFormatter={(r) => `${r} ★`}
                  tick={{ fontSize: 12, fill: '#334155' }}
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(value: any, name: any, item: any) => [
                    `${value} ratings`,
                    item.payload.label,
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {data.ratingDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={distributionColors[index % distributionColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Course-by-Course Table */}
        <Card
          title="Performance by Course Offering"
          subtitle="Average student rating and evaluation counts per course"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Course</th>
                  <th className="py-2.5 px-3 text-center">Submissions</th>
                  <th className="py-2.5 px-3 text-right">Average</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.coursesBreakdown.map((course) => (
                  <tr key={course.courseCode} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3">
                      <div className="font-mono font-bold text-emerald-800">
                        {course.courseCode}
                      </div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[200px]">
                        {course.courseTitle}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-slate-700">
                      {course.evaluationCount}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                      {course.average.toFixed(2)} / 5.0
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};
