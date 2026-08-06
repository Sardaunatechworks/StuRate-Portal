import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useModal } from '../../context/ModalContext';
import { UserCheck, Plus, Trash2, GraduationCap } from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    courseId: '',
    lecturerId: '',
    academicSession: '2025/2026',
    semester: 'FIRST'
  });

  const { showFeedback, showConfirm } = useModal();

  const fetchData = async () => {
    try {
      const [asgRes, crsRes, lecRes] = await Promise.all([
        API.get('/admin/assignments'),
        API.get('/admin/courses'),
        API.get('/admin/lecturers')
      ]);
      setAssignments(asgRes.data);
      setCourses(crsRes.data);
      setLecturers(lecRes.data);

      if (crsRes.data.length > 0 && !formData.courseId) {
        setFormData(prev => ({ ...prev, courseId: crsRes.data[0].id }));
      }
      if (lecRes.data.length > 0 && !formData.lecturerId) {
        setFormData(prev => ({ ...prev, lecturerId: lecRes.data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching assignments data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/admin/assignments', {
        courseId: formData.courseId || (courses[0]?.id || ''),
        lecturerId: formData.lecturerId || (lecturers[0]?.id || ''),
        academicSession: formData.academicSession,
        semester: formData.semester
      });
      setIsModalOpen(false);
      fetchData();
      showFeedback({
        title: 'Lecturer Assigned',
        message: 'Course assignment was saved successfully.',
        type: 'success'
      });
    } catch (err: any) {
      showFeedback({
        title: 'Assignment Failed',
        message: err.response?.data?.message || 'Error assigning lecturer to course',
        type: 'error'
      });
    }
  };

  const handleDelete = (id: string, courseCode?: string) => {
    showConfirm({
      title: 'Confirm Assignment Deletion',
      message: `Are you sure you want to delete course assignment${courseCode ? ` for ${courseCode}` : ''}?`,
      confirmLabel: 'Delete Assignment',
      onConfirm: async () => {
        try {
          await API.delete(`/admin/assignments/${id}`);
          fetchData();
          showFeedback({
            title: 'Assignment Removed',
            message: 'Course assignment was removed successfully.',
            type: 'success'
          });
        } catch (err: any) {
          showFeedback({
            title: 'Delete Failed',
            message: err.response?.data?.message || 'Error deleting assignment',
            type: 'error'
          });
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Course Assignments</h1>
          <p className="text-xs text-zinc-500 mt-1">Assign academic staff to deliver specific courses for active academic sessions.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="template-btn-black flex items-center gap-2">
          <Plus size={16} />
          <span>Assign Lecturer</span>
        </button>
      </div>

      {isLoading ? (
        <p className="text-xs text-zinc-500">Loading course assignments...</p>
      ) : assignments.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-zinc-500 text-xs border border-zinc-200">
          No course assignments found. Click "Assign Lecturer" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {assignments.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-zinc-100 text-zinc-900 font-mono font-extrabold text-xs border border-zinc-200">
                  {a.course?.code}
                </span>
                <button
                  onClick={() => handleDelete(a.id, a.course?.code)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <div>
                <h3 className="text-base font-extrabold text-zinc-900 leading-snug">{a.course?.title}</h3>
                <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-zinc-900">
                  <GraduationCap size={16} />
                  <span>{a.lecturer ? `${a.lecturer.title} ${a.lecturer.user?.name}` : 'Unassigned'}</span>
                </div>
              </div>
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500 font-mono">
                <span>{a.academicSession}</span>
                <span className="uppercase">{a.semester} Sem</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-zinc-200 shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-zinc-900">New Course Assignment</h3>
            <form onSubmit={handleAssign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Select Course</label>
                <select
                  value={formData.courseId}
                  onChange={e => setFormData({ ...formData, courseId: e.target.value })}
                  className="w-full template-input"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Assign Lecturer</label>
                <select
                  value={formData.lecturerId}
                  onChange={e => setFormData({ ...formData, lecturerId: e.target.value })}
                  className="w-full template-input"
                >
                  {lecturers.map(l => (
                    <option key={l.id} value={l.id}>{l.title} {l.user?.name} ({l.staffId})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Session</label>
                  <input
                    type="text"
                    required
                    value={formData.academicSession}
                    onChange={e => setFormData({ ...formData, academicSession: e.target.value })}
                    className="w-full template-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Semester</label>
                  <select
                    value={formData.semester}
                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full template-input"
                  >
                    <option value="FIRST">First Semester</option>
                    <option value="SECOND">Second Semester</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="template-btn-outline">
                  Cancel
                </button>
                <button type="submit" className="template-btn-black">
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

