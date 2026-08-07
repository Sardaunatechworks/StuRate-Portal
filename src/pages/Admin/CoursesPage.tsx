import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useModal } from '../../context/ModalContext';
import { BookOpen, Plus, Trash2, Search } from 'lucide-react';

export const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    creditUnit: 3,
    departmentId: ''
  });

  const { showFeedback, showConfirm } = useModal();

  const fetchData = async () => {
    try {
      const [coursesRes, deptsRes] = await Promise.all([
        API.get('/admin/courses'),
        API.get('/admin/departments')
      ]);
      setCourses(coursesRes.data);
      setDepartments(deptsRes.data);
      if (deptsRes.data.length > 0 && !formData.departmentId) {
        setFormData(prev => ({ ...prev, departmentId: deptsRes.data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching courses data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/admin/courses', {
        code: formData.code.toUpperCase(),
        title: formData.title,
        creditUnit: Number(formData.creditUnit),
        departmentId: formData.departmentId || (departments[0]?.id || '')
      });
      setIsModalOpen(false);
      const createdCode = formData.code.toUpperCase();
      setFormData({ code: '', title: '', creditUnit: 3, departmentId: departments[0]?.id || '' });
      fetchData();
      showFeedback({
        title: 'Course Created',
        message: `Course ${createdCode} - ${formData.title} has been added successfully.`,
        type: 'success'
      });
    } catch (err: any) {
      showFeedback({
        title: 'Error Creating Course',
        message: err.response?.data?.message || 'Error creating course',
        type: 'error'
      });
    }
  };

  const handleDelete = (id: string, code: string) => {
    showConfirm({
      title: 'Confirm Course Deletion',
      message: `Are you sure you want to delete course ${code}? This action cannot be undone.`,
      confirmLabel: 'Delete Course',
      onConfirm: async () => {
        try {
          await API.delete(`/admin/courses/${id}`);
          fetchData();
          showFeedback({
            title: 'Course Deleted',
            message: `Course ${code} was deleted successfully.`,
            type: 'success'
          });
        } catch (err: any) {
          showFeedback({
            title: 'Delete Failed',
            message: err.response?.data?.message || 'Error deleting course',
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
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Course Catalog</h1>
          <p className="text-xs text-zinc-500 mt-1">Manage academic course codes, unit loads, and departmental associations.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="template-btn-black flex items-center gap-2">
          <Plus size={16} />
          <span>Add New Course</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm flex items-center gap-3">
        <Search size={18} className="text-zinc-400" />
        <input
          type="text"
          placeholder="Search by course code or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-zinc-900 text-sm focus:outline-none w-full placeholder-zinc-400"
        />
      </div>

      {isLoading ? (
        <p className="text-xs text-zinc-500">Loading courses...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-zinc-500 text-xs border border-zinc-200">
          No courses found. Click "Add New Course" to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-xl bg-zinc-100 text-zinc-900 border border-zinc-200 font-mono font-bold text-xs">
                    {c.code}
                  </span>
                  <button
                    onClick={() => handleDelete(c.id, c.code)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="text-base font-extrabold text-zinc-900 leading-snug">{c.title}</h3>
                <p className="text-xs text-zinc-500 mt-1">{c.department?.name}</p>
              </div>
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Credit Load</span>
                <span className="font-bold text-zinc-900 bg-zinc-100 px-2.5 py-0.5 rounded-full border border-zinc-200">
                  {c.creditUnit} Units
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-zinc-200 shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-zinc-900">Add Course to Catalog</h3>
            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Code</label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    className="w-full template-input uppercase font-mono"
                    placeholder="CSC401"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Credit Unit</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    required
                    value={formData.creditUnit}
                    onChange={e => setFormData({ ...formData, creditUnit: Number(e.target.value) })}
                    className="w-full template-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full template-input"
                  placeholder="Software Engineering Methodology"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Department</label>
                <select
                  value={formData.departmentId}
                  onChange={e => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full template-input"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="template-btn-outline">
                  Cancel
                </button>
                <button type="submit" className="template-btn-black">
                  Save Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

