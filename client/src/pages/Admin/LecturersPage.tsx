import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useModal } from '../../context/ModalContext';
import { GraduationCap, Search, Plus, Trash2 } from 'lucide-react';

export const LecturersPage: React.FC = () => {
  const [lecturers, setLecturers] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Dr.',
    name: '',
    email: '',
    staffId: '',
    departmentId: ''
  });

  const { showFeedback, showConfirm } = useModal();

  const fetchData = async () => {
    try {
      const [lecsRes, deptsRes] = await Promise.all([
        API.get('/admin/lecturers'),
        API.get('/admin/departments')
      ]);
      setLecturers(lecsRes.data);
      setDepartments(deptsRes.data);
      if (deptsRes.data.length > 0 && !formData.departmentId) {
        setFormData(prev => ({ ...prev, departmentId: deptsRes.data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching lecturers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = lecturers.filter(l =>
    (l.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.staffId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLecturer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/admin/lecturers', {
        title: formData.title,
        name: formData.name,
        email: formData.email,
        staffId: formData.staffId,
        departmentId: formData.departmentId || (departments[0]?.id || '')
      });
      setIsModalOpen(false);
      const createdName = `${formData.title} ${formData.name}`;
      setFormData({ title: 'Dr.', name: '', email: '', staffId: '', departmentId: departments[0]?.id || '' });
      fetchData();
      showFeedback({
        title: 'Lecturer Created',
        message: `${createdName} (${formData.staffId}) profile was created successfully.`,
        type: 'success'
      });
    } catch (err: any) {
      showFeedback({
        title: 'Error Registering Lecturer',
        message: err.response?.data?.message || 'Error creating lecturer',
        type: 'error'
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    showConfirm({
      title: 'Confirm Lecturer Removal',
      message: `Are you sure you want to remove lecturer profile for ${name}? This action cannot be undone.`,
      confirmLabel: 'Remove Lecturer',
      onConfirm: async () => {
        try {
          await API.delete(`/admin/lecturers/${id}`);
          fetchData();
          showFeedback({
            title: 'Lecturer Removed',
            message: `Lecturer profile for ${name} was deleted successfully.`,
            type: 'success'
          });
        } catch (err: any) {
          showFeedback({
            title: 'Delete Failed',
            message: err.response?.data?.message || 'Error deleting lecturer',
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
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Lecturers Directory</h1>
          <p className="text-xs text-zinc-500 mt-1">Manage academic staff, staff IDs, and departmental allocations.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="template-btn-black flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add New Lecturer</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm flex items-center gap-3">
        <Search size={18} className="text-zinc-400" />
        <input
          type="text"
          placeholder="Search by lecturer name or staff ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-zinc-900 text-sm focus:outline-none w-full placeholder-zinc-400"
        />
      </div>

      {isLoading ? (
        <p className="text-xs text-zinc-500">Loading lecturers...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center text-zinc-500 text-xs border border-zinc-200">
          No lecturers found. Click "Add New Lecturer" to register one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((l) => (
            <div key={l.id} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-900 border border-zinc-200 text-xs font-mono font-bold">
                    {l.staffId}
                  </span>
                  <button
                    onClick={() => handleDelete(l.id, `${l.title} ${l.user?.name}`)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <h3 className="text-base font-extrabold text-zinc-900">{l.title} {l.user?.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{l.user?.email}</p>
              </div>
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-600">
                <span>Department</span>
                <span className="font-bold text-black">{l.department?.name || 'Unassigned'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-zinc-200 shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-zinc-900">Add Academic Staff</h3>
            <form onSubmit={handleAddLecturer} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Title</label>
                  <select
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    className="w-full template-input"
                  >
                    <option value="Dr.">Dr.</option>
                    <option value="Prof.">Prof.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full template-input"
                    placeholder="Alan Turing"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full template-input"
                  placeholder="lecturer@university.edu.ng"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Staff ID</label>
                <input
                  type="text"
                  required
                  value={formData.staffId}
                  onChange={e => setFormData({ ...formData, staffId: e.target.value })}
                  className="w-full template-input"
                  placeholder="e.g. FUD/LR/CSC/001"
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
                  Save Lecturer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

