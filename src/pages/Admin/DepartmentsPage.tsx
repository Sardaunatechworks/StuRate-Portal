import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useModal } from '../../context/ModalContext';
import { Building2, Plus, Users, GraduationCap, BookOpen } from 'lucide-react';

export const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', name: '', description: '' });

  const { showFeedback } = useModal();

  const fetchDepartments = async () => {
    try {
      const res = await API.get('/admin/departments');
      setDepartments(res.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleAddDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/admin/departments', {
        code: formData.code.toUpperCase(),
        name: formData.name,
        description: formData.description
      });
      setIsModalOpen(false);
      setFormData({ code: '', name: '', description: '' });
      fetchDepartments();
      showFeedback({
        title: 'Department Created',
        message: `Department ${formData.name} (${formData.code.toUpperCase()}) was created successfully.`,
        type: 'success'
      });
    } catch (err: any) {
      showFeedback({
        title: 'Error Creating Department',
        message: err.response?.data?.message || 'Failed to create department.',
        type: 'error'
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Academic Departments</h1>
          <p className="text-xs text-zinc-500 mt-1">Manage university faculties and departmental subdivisions.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="template-btn-black flex items-center gap-2">
          <Plus size={16} />
          <span>Add Department</span>
        </button>
      </div>

      {isLoading ? (
        <p className="text-xs text-zinc-500">Loading departments...</p>
      ) : departments.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-zinc-500 text-xs border border-zinc-200">
          No departments registered yet. Click "Add Department" to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-xl bg-zinc-100 text-zinc-900 font-mono font-extrabold text-xs border border-zinc-200">
                  {d.code}
                </span>
                <span className="text-xs text-zinc-400 font-medium">Faculty / Department</span>
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-zinc-900">{d.name}</h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{d.description || 'No description provided.'}</p>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-100 text-center">
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/60">
                  <Users size={16} className="mx-auto text-zinc-900 mb-1" />
                  <p className="text-lg font-extrabold text-zinc-900">{d._count?.students || 0}</p>
                  <p className="text-[10px] text-zinc-500">Students</p>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/60">
                  <GraduationCap size={16} className="mx-auto text-zinc-900 mb-1" />
                  <p className="text-lg font-extrabold text-zinc-900">{d._count?.lecturers || 0}</p>
                  <p className="text-[10px] text-zinc-500">Lecturers</p>
                </div>
                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/60">
                  <BookOpen size={16} className="mx-auto text-zinc-900 mb-1" />
                  <p className="text-lg font-extrabold text-zinc-900">{d._count?.courses || 0}</p>
                  <p className="text-[10px] text-zinc-500">Courses</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-zinc-200 shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-zinc-900">Add Department</h3>
            <form onSubmit={handleAddDept} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Department Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value })}
                  className="w-full template-input uppercase font-mono"
                  placeholder="e.g. MTH"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full template-input"
                  placeholder="Department of Mathematics"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full template-input"
                  placeholder="Brief description of department..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="template-btn-outline">
                  Cancel
                </button>
                <button type="submit" className="template-btn-black">
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

