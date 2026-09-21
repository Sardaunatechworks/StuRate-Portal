import React, { useEffect, useState } from 'react';
import { assignmentApi, lecturerApi, courseApi } from '../../services/api';
import { CourseAssignment, LecturerProfile, Course, Semester } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Plus, Trash2, Link2 } from 'lucide-react';

export const AssignmentsPage: React.FC = () => {
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [lecturers, setLecturers] = useState<LecturerProfile[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    lecturerId: '',
    courseId: '',
    academicSession: '2025/2026',
    semester: 'FIRST' as Semester,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const [assignList, lecList, courseList] = await Promise.all([
        assignmentApi.getAll(),
        lecturerApi.getAll(),
        courseApi.getAll(),
      ]);
      setAssignments(assignList);
      setLecturers(lecList);
      setCourses(courseList);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      lecturerId: lecturers[0]?.id || '',
      courseId: courses[0]?.id || '',
      academicSession: '2025/2026',
      semester: 'FIRST',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setIsSubmitting(true);

    try {
      await assignmentApi.create(formData);
      setSuccessMessage('Course assigned to lecturer successfully.');
      setIsModalOpen(false);
      fetchAssignments();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this course assignment?')) {
      return;
    }

    try {
      await assignmentApi.delete(id);
      setSuccessMessage('Course assignment deleted successfully.');
      fetchAssignments();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Course Assignments
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign lecturers to courses for specific academic sessions and semesters
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAddModal}
        >
          Assign Course
        </Button>
      </div>

      {successMessage && (
        <AlertBanner
          type="success"
          message={successMessage}
          onClose={() => setSuccessMessage(null)}
        />
      )}

      {error && (
        <AlertBanner
          type="error"
          message={error}
          onClose={() => setError(null)}
        />
      )}

      <Card>
        {isLoading ? (
          <LoadingSpinner message="Fetching course assignments..." />
        ) : assignments.length === 0 ? (
          <EmptyState
            icon={<Link2 className="w-6 h-6" />}
            title="No Assignments Configured"
            description="Assign teaching staff to their respective course offerings for this academic term."
            actionLabel="Assign Course"
            onAction={handleOpenAddModal}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Course</th>
                  <th className="py-3 px-4">Lecturer</th>
                  <th className="py-3 px-4">Academic Session</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4 text-center">Evaluations</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((a) => (
                  <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-mono font-bold text-emerald-800">
                        {a.course.code}
                      </div>
                      <div className="text-slate-600 text-[11px] font-medium">
                        {a.course.title}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {a.lecturer.user?.name}
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        {a.lecturer.staffId} • {a.lecturer.department?.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {a.academicSession}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="neutral">{a.semester} Semester</Badge>
                    </td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {a._count?.evaluations || 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="p-1.5 rounded-lg text-rose-600 hover:text-rose-800 hover:bg-rose-50"
                        title="Delete assignment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign Lecturer to Course"
        description="Allocate an academic staff member to deliver a course"
      >
        {modalError && (
          <AlertBanner type="error" message={modalError} className="mb-4" />
        )}
        <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Lecturer *
            </label>
            <select
              required
              value={formData.lecturerId}
              onChange={(e) =>
                setFormData({ ...formData, lecturerId: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
            >
              {lecturers.map((lec) => (
                <option key={lec.id} value={lec.id}>
                  {lec.user?.name} ({lec.staffId}) - {lec.department?.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Select Course *
            </label>
            <select
              required
              value={formData.courseId}
              onChange={(e) =>
                setFormData({ ...formData, courseId: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} - {c.title} ({c.level} Level)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Academic Session (YYYY/YYYY) *
              </label>
              <input
                type="text"
                required
                pattern="\d{4}/\d{4}"
                value={formData.academicSession}
                onChange={(e) =>
                  setFormData({ ...formData, academicSession: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                placeholder="2025/2026"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Semester *
              </label>
              <select
                value={formData.semester}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    semester: e.target.value as Semester,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
              >
                <option value="FIRST">First Semester</option>
                <option value="SECOND">Second Semester</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Confirm Assignment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
