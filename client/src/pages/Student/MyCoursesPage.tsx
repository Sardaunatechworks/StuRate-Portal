import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { BookMarked, CheckCircle2, ArrowRight, GraduationCap, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.get('/student/courses')
      .then(res => {
        setCourses(res.data?.courses || []);
      })
      .catch(err => {
        console.error('Error fetching student courses:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">My Enrolled Courses & Lecturers</h1>
        <p className="text-xs text-zinc-500 mt-1">Select an assigned course to evaluate your lecturer's teaching effectiveness.</p>
      </div>

      {isLoading ? (
        <p className="text-xs text-zinc-500">Loading enrolled courses...</p>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-zinc-500 text-xs border border-zinc-200">
          No courses assigned for evaluation.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((c) => (
            <div key={c.courseAssignmentId} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-xl bg-zinc-100 text-zinc-900 font-mono font-bold text-xs border border-zinc-200">
                    {c.courseCode}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    c.isEvaluated
                      ? 'bg-zinc-100 text-zinc-800 border border-zinc-200'
                      : 'bg-black text-white'
                  }`}>
                    {c.isEvaluated ? 'Evaluated' : 'Pending Evaluation'}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-zinc-900 mt-3 leading-snug">{c.courseTitle}</h3>
                <p className="text-xs text-zinc-500 mt-1">{c.department} • {c.creditUnit} Credit Units</p>

                <div className="mt-4 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/60 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Assigned Lecturer</p>
                    <h4 className="text-sm font-bold text-zinc-900">{c.lecturerName}</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">{c.lecturerStaffId}</p>
                  </div>
                </div>
              </div>

              {c.isEvaluated ? (
                <div className="w-full py-3 px-4 rounded-xl bg-zinc-100 text-zinc-500 text-xs font-semibold flex items-center justify-center gap-2 border border-zinc-200 cursor-default">
                  <CheckCircle2 size={16} className="text-black" />
                  <span>Evaluation Submitted for this Session</span>
                </div>
              ) : (
                <Link
                  to={`/student/evaluate/${c.courseAssignmentId}`}
                  className="template-btn-black w-full flex items-center justify-center gap-2"
                >
                  <span>Evaluate {c.lecturerName}</span>
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

