import React, { useEffect, useState } from 'react';
import {
  adminPortalApi,
  departmentApi,
  lecturerApi,
  courseApi,
  periodApi,
} from '../../services/api';
import {
  AdminReportsData,
  Department,
  LecturerProfile,
  Course,
  EvaluationPeriod,
} from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { BarChart3, Filter, Printer, Star } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reportData, setReportData] = useState<AdminReportsData | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [lecturers, setLecturers] = useState<LecturerProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [periods, setPeriods] = useState<EvaluationPeriod[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [deptFilter, setDeptFilter] = useState('');
  const [lecFilter, setLecFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const data = await adminPortalApi.getReports({
        departmentId: deptFilter || undefined,
        lecturerId: lecFilter || undefined,
        courseId: courseFilter || undefined,
        evaluationPeriodId: periodFilter || undefined,
      });
      setReportData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([
      departmentApi.getAll(),
      lecturerApi.getAll(),
      courseApi.getAll(),
      periodApi.getAll(),
    ])
      .then(([depts, lecs, crs, per]) => {
        setDepartments(depts);
        setLecturers(lecs);
        setCourses(crs);
        setPeriods(per);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchReports();
  }, [deptFilter, lecFilter, courseFilter, periodFilter]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Institutional Evaluation Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated teaching performance reports derived from submitted student ratings
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Printer className="w-4 h-4" />}
          onClick={handlePrint}
        >
          Print Report
        </Button>
      </div>

      {error && (
        <AlertBanner
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* Filter Bar */}
      <Card>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Department
            </label>
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Lecturer
            </label>
            <select
              value={lecFilter}
              onChange={(e) => setLecFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">All Lecturers</option>
              {lecturers.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.user?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Course
            </label>
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">All Courses</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-600 mb-1">
              Evaluation Period
            </label>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
            >
              <option value="">All Periods</option>
              {periods.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Reports Content */}
      <Card>
        {isLoading ? (
          <LoadingSpinner message="Calculating evaluation reports..." />
        ) : !reportData || reportData.lecturerSummaries.length === 0 ? (
          <EmptyState
            icon={<BarChart3 className="w-6 h-6" />}
            title="No Evaluation Data"
            description="No student evaluations match the specified institutional report filters."
          />
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Total Evaluations Analyzed
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  {reportData.totalEvaluationsFound}
                </h3>
              </div>
              <Badge variant="success">Actual Database Records</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Lecturer</th>
                    <th className="py-3 px-4">Staff ID</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Courses Evaluated</th>
                    <th className="py-3 px-4 text-center">Evaluations</th>
                    <th className="py-3 px-4 text-right">Average Rating</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reportData.lecturerSummaries.map((lec) => (
                    <tr
                      key={lec.lecturerId}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {lec.lecturerName}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {lec.staffId}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {lec.departmentName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-slate-800 text-[11px]">
                          {lec.coursesList || 'None'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-slate-800">
                        {lec.evaluationCount}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 font-bold text-emerald-700">
                          <Star className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
                          <span>{lec.averageScore.toFixed(2)}</span>
                          <span className="text-slate-400 font-normal">/ 5.0</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
