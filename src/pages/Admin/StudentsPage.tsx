import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useModal } from '../../context/ModalContext';
import { UserCheck, Plus, Trash2, Search } from 'lucide-react';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    level: 100,
    departmentId: ''
  });

  const { showFeedback, showConfirm } = useModal();

  const fetchData = async () => {
    try {
      const [stusRes, deptsRes] = await Promise.all([
        API.get('/admin/students'),
        API.get('/admin/departments')
      ]);
      setStudents(stusRes.data);
      setDepartments(deptsRes.data);
      if (deptsRes.data.length > 0 && !formData.departmentId) {
        setFormData(prev => ({ ...prev, departmentId: deptsRes.data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching students data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = students.filter(s =>
    (s.user?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.studentId || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/admin/students', {
        name: formData.name,
        email: formData.email,
        studentId: formData.studentId,
        level: Number(formData.level),
        departmentId: formData.departmentId || (departments[0]?.id || '')
      });
      setIsModalOpen(false);
      const createdName = formData.name;
      setFormData({ name: '', email: '', studentId: '', level: 100, departmentId: departments[0]?.id || '' });
      fetchData();
      showFeedback({
        title: 'Student Registered',
        message: `Student record for ${createdName} (${formData.studentId}) was created successfully.`,
        type: 'success'
      });
    } catch (err: any) {
      showFeedback({
        title: 'Error Registering Student',
        message: err.response?.data?.message || 'Error registering student',
        type: 'error'
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    showConfirm({
      title: 'Confirm Student Deletion',
      message: `Are you sure you want to delete student record for ${name}? This action cannot be undone.`,
      confirmLabel: 'Delete Student',
      onConfirm: async () => {
        try {
          await API.delete(`/admin/students/${id}`);
          fetchData();
          showFeedback({
            title: 'Student Deleted',
            message: `Student record for ${name} was deleted successfully.`,
            type: 'success'
          });
        } catch (err: any) {
          showFeedback({
            title: 'Delete Failed',
            message: err.response?.data?.message || 'Error deleting student',
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
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Students Directory</h1>
          <p className="text-xs text-zinc-500 mt-1">Manage registered student records, matriculation numbers, and departments.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="template-btn-black flex items-center gap-2"
        >
          <Plus size={16} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-sm flex items-center gap-3">
        <Search size={18} className="text-zinc-400" />
        <input
          type="text"
          placeholder="Search by student name or matric number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none text-zinc-900 text-sm focus:outline-none w-full placeholder-zinc-400"
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="text-xs text-zinc-500 p-6">Loading students...</p>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            No students found. Click "Add New Student" to register one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-700">
              <thead className="bg-zinc-100/80 text-zinc-500 uppercase font-semibold border-b border-zinc-200/80">
                <tr>
                  <th className="px-6 py-4">Matric Number</th>
                  <th className="px-6 py-4">Full Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Department</th>
                  <th className="px-6 py-4">Level</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200/60">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-black">{s.studentId}</td>
                    <td className="px-6 py-4 font-bold text-zinc-900 flex items-center gap-2">
                      <UserCheck size={14} className="text-emerald-600" />
                      <span>{s.user?.name}</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500">{s.user?.email}</td>
                    <td className="px-6 py-4">{s.department?.name || 'Unassigned'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full bg-zinc-100 text-zinc-800 font-semibold border border-zinc-200">
                        {s.level} Level
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(s.id, s.user?.name)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Student"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-zinc-200 shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-zinc-900">Register New Student</h3>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full template-input"
                  placeholder="e.g. Samuel Jackson"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full template-input"
                  placeholder="student@university.edu.ng"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Matriculation Number</label>
                <input
                  type="text"
                  required
                  value={formData.studentId}
                  onChange={e => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full template-input"
                  placeholder="e.g. FCP/CIT/22/1001"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Academic Level</label>
                  <select
                    value={formData.level}
                    onChange={e => setFormData({ ...formData, level: Number(e.target.value) })}
                    className="w-full template-input"
                  >
                    <option value={100}>100 Level</option>
                    <option value={200}>200 Level</option>
                    <option value={300}>300 Level</option>
                    <option value={400}>400 Level</option>
                    <option value={500}>500 Level</option>
                  </select>
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
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="template-btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="template-btn-black">
                  Create Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

