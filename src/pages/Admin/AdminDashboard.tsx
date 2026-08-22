import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import {
  Users,
  GraduationCap,
  BookOpen,
  Building2,
  FileCheck2,
  Star,
  FileText,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalLecturers: 0,
    totalCourses: 0,
    totalDepartments: 0,
    totalEvaluations: 0,
    averageRating: 0,
    activePeriod: null as any
  });
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/analytics'),
      API.get('/admin/courses')
    ]).then(([analyticsRes, coursesRes]) => {
      if (analyticsRes.data) setStats(analyticsRes.data);
      if (coursesRes.data) setCourses(coursesRes.data.slice(0, 5));
    }).catch(err => {
      console.error('Error fetching admin dashboard stats:', err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const metricCards = [
    { title: 'Total Registered Students', count: stats.totalStudents.toString(), icon: Users },
    { title: 'Academic Lecturers', count: stats.totalLecturers.toString(), icon: GraduationCap },
    { title: 'Academic Departments', count: stats.totalDepartments.toString(), icon: Building2 },
    { title: 'Total Courses Offered', count: stats.totalCourses.toString(), icon: BookOpen },
    { title: 'Submitted Evaluations', count: stats.totalEvaluations.toString(), icon: FileCheck2 },
    { title: 'Overall Rating Average', count: stats.averageRating ? `${stats.averageRating} / 5.0` : 'N/A', icon: Star },
    { title: 'Active Evaluation Period', count: stats.activePeriod ? stats.activePeriod.title : 'None Active', icon: Calendar },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-extrabold text-[#1A2E22] dark:text-zinc-100 tracking-tight">System Admin Dashboard</h1>
        <p className="text-xs text-[#4A6350] dark:text-academic-400 mt-1">Real-time institutional metrics and evaluation monitoring.</p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-white dark:bg-[#142620] rounded-2xl p-6 border border-academic-200/80 dark:border-academic-800/60 shadow-sm hover:shadow-md hover:border-academic-300 transition-all">
              <Icon size={32} className="text-academic-700 dark:text-gold-400 stroke-[1.5] mb-4" />
              <p className="text-xs font-medium text-[#4A6350] dark:text-academic-400">{card.title}</p>
              <h3 className="text-2xl font-extrabold text-[#1A2E22] dark:text-zinc-100 mt-1 truncate">{card.count}</h3>
            </div>
          );
        })}
      </div>

      {/* Registered Courses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1A2E22] dark:text-zinc-100">System Courses</h2>
          <Link to="/admin/courses" className="text-xs font-semibold text-academic-700 dark:text-gold-400 hover:underline">
            View All Courses
          </Link>
        </div>

        <div className="bg-white dark:bg-[#142620] rounded-2xl p-5 border border-academic-200/80 dark:border-academic-800/60 shadow-sm space-y-3">
          {isLoading ? (
            <p className="text-xs text-[#4A6350] p-4">Loading system courses...</p>
          ) : courses.length === 0 ? (
            <p className="text-xs text-[#4A6350] p-4">No courses registered in database.</p>
          ) : (
            courses.map((course) => (
              <div key={course.id} className="p-4 rounded-xl bg-academic-50/80 dark:bg-academic-900/30 border border-academic-200/60 dark:border-academic-800/60 flex items-center justify-between hover:bg-academic-100/60 dark:hover:bg-academic-900/50 transition-colors">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-academic-700 dark:bg-gold-400 text-white dark:text-academic-950 flex items-center justify-center font-bold shadow-sm">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1A2E22] dark:text-zinc-100">{course.code}</h4>
                    <p className="text-xs text-[#4A6350] dark:text-academic-400">{course.title} • {course.department?.name || 'General'}</p>
                  </div>
                </div>

                <Link
                  to="/admin/courses"
                  className="template-btn-primary"
                >
                  Manage Courses
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
