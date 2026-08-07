import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { RatingStars } from '../../components/RatingStars';
import { Download, Building2, GraduationCap } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [departmentReports, setDepartmentReports] = useState<any[]>([]);
  const [lecturerReports, setLecturerReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/reports/departments'),
      API.get('/analytics')
    ]).then(([deptsRes, analyticsRes]) => {
      setDepartmentReports(deptsRes.data || []);
      setLecturerReports(analyticsRes.data?.allLecturersStats || analyticsRes.data?.topLecturers || []);
    }).catch(err => {
      console.error('Error fetching reports data:', err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Evaluation Reports</h1>
          <p className="text-xs text-zinc-500 mt-1">Read-only institutional summary reports by department and academic performance.</p>
        </div>
        <button onClick={() => window.print()} className="template-btn-outline flex items-center gap-2">
          <Download size={16} />
          <span>Export Summary Report</span>
        </button>
      </div>

      {/* Department Summary Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
          <Building2 className="text-zinc-900" size={18} />
          <span>Departmental Teaching Effectiveness Summary</span>
        </h3>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-xs text-zinc-500 p-4">Loading department reports...</p>
          ) : departmentReports.length === 0 ? (
            <p className="text-xs text-zinc-500 p-4">No department reports available.</p>
          ) : (
            <table className="w-full text-left text-xs text-zinc-700">
              <thead className="bg-zinc-100/80 text-zinc-500 uppercase font-semibold border-b border-zinc-200/80">
                <tr>
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3 text-center">Courses</th>
                  <th className="px-4 py-3 text-center">Lecturers</th>
                  <th className="px-4 py-3 text-center">Evaluations</th>
                  <th className="px-4 py-3 text-right">Average Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60">
                {departmentReports.map((d, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-mono font-bold text-black">{d.code}</td>
                    <td className="px-4 py-3 font-bold text-zinc-900">{d.name}</td>
                    <td className="px-4 py-3 text-center">{d.totalCourses}</td>
                    <td className="px-4 py-3 text-center">{d.totalLecturers}</td>
                    <td className="px-4 py-3 text-center font-bold text-zinc-900">{d.totalEvaluations}</td>
                    <td className="px-4 py-3 text-right font-bold text-zinc-900">{d.averageRating} / 5.0</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Lecturer Performance Table Card */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
        <h3 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
          <GraduationCap className="text-zinc-900" size={18} />
          <span>Lecturer Ratings & Evaluation Counts</span>
        </h3>
        <div className="overflow-x-auto">
          {isLoading ? (
            <p className="text-xs text-zinc-500 p-4">Loading lecturer reports...</p>
          ) : lecturerReports.length === 0 ? (
            <p className="text-xs text-zinc-500 p-4">No lecturer evaluation data recorded yet.</p>
          ) : (
            <table className="w-full text-left text-xs text-zinc-700">
              <thead className="bg-zinc-100/80 text-zinc-500 uppercase font-semibold border-b border-zinc-200/80">
                <tr>
                  <th className="px-4 py-3">Staff ID</th>
                  <th className="px-4 py-3">Lecturer Name</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3 text-center">Evaluations Submitted</th>
                  <th className="px-4 py-3 text-right">Rating Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60">
                {lecturerReports.map((l, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 font-mono font-semibold text-black">{l.staffId}</td>
                    <td className="px-4 py-3 font-bold text-zinc-900">{l.name}</td>
                    <td className="px-4 py-3 text-zinc-500">{l.department}</td>
                    <td className="px-4 py-3 text-center font-bold text-zinc-900">{l.evaluationCount}</td>
                    <td className="px-4 py-3 text-right">
                      <RatingStars value={l.averageRating} readOnly size={14} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

