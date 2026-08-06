import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useModal } from '../../context/ModalContext';
import { Clock, ToggleLeft, ToggleRight, Plus, Calendar, AlertCircle } from 'lucide-react';

export const EvaluationPeriodPage: React.FC = () => {
  const [periods, setPeriods] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    academicSession: '2025/2026',
    semester: 'FIRST',
    startDate: '2026-08-01',
    endDate: '2026-09-30'
  });

  const { showFeedback } = useModal();

  const fetchPeriods = async () => {
    try {
      const res = await API.get('/admin/evaluation-periods');
      setPeriods(res.data);
    } catch (err) {
      console.error('Error fetching evaluation periods:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const togglePeriod = async (p: any) => {
    try {
      await API.patch(`/admin/evaluation-periods/${p.id}/toggle`, {
        isActive: !p.isActive
      });
      fetchPeriods();
      showFeedback({
        title: 'Evaluation Period Status',
        message: `Evaluation period "${p.title}" status changed to ${!p.isActive ? 'Active' : 'Inactive'}.`,
        type: 'success'
      });
    } catch (err: any) {
      showFeedback({
        title: 'Update Error',
        message: err.response?.data?.message || 'Error toggling evaluation period',
        type: 'error'
      });
    }
  };

  const handleAddPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/admin/evaluation-periods', {
        title: formData.title,
        academicSession: formData.academicSession,
        semester: formData.semester,
        startDate: formData.startDate,
        endDate: formData.endDate,
        isActive: false
      });
      setIsModalOpen(false);
      const createdTitle = formData.title;
      setFormData({
        title: '',
        academicSession: '2025/2026',
        semester: 'FIRST',
        startDate: '2026-08-01',
        endDate: '2026-09-30'
      });
      fetchPeriods();
      showFeedback({
        title: 'Evaluation Period Created',
        message: `Evaluation period "${createdTitle}" created successfully.`,
        type: 'success'
      });
    } catch (err: any) {
      showFeedback({
        title: 'Error Creating Period',
        message: err.response?.data?.message || 'Error creating evaluation period',
        type: 'error'
      });
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Evaluation Sessions</h1>
          <p className="text-xs text-zinc-500 mt-1">Open or close evaluation periods for active academic terms.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="template-btn-black flex items-center gap-2">
          <Plus size={16} />
          <span>New Session</span>
        </button>
      </div>

      <div className="p-4 bg-white border border-zinc-200/80 rounded-2xl flex items-start gap-3 text-xs text-zinc-700 shadow-sm">
        <AlertCircle size={18} className="shrink-0 text-black mt-0.5" />
        <span>
          <strong>Constraint Notice:</strong> Only one evaluation session can be active at any given time. Enabling a session automatically opens student evaluation forms across all assigned courses.
        </span>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-xs text-zinc-500">Loading evaluation periods...</p>
        ) : periods.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-zinc-500 text-xs border border-zinc-200">
            No evaluation periods defined. Click "New Session" to create one.
          </div>
        ) : (
          periods.map((p) => (
            <div key={p.id} className={`bg-white rounded-2xl p-6 border transition-all ${
              p.isActive ? 'border-zinc-900 shadow-md ring-1 ring-black' : 'border-zinc-200/80 shadow-sm'
            }`}>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-extrabold text-zinc-900">{p.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      p.isActive
                        ? 'bg-black text-white'
                        : 'bg-zinc-100 text-zinc-500 border border-zinc-200'
                    }`}>
                      {p.isActive ? 'ACTIVE' : 'CLOSED'}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-500 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-zinc-900" />
                      <span>Session: {p.academicSession} ({p.semester} Sem)</span>
                    </div>
                    <div>
                      <span>Start: {formatDate(p.startDate)} • End: {formatDate(p.endDate)}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => togglePeriod(p)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                    p.isActive
                      ? 'bg-black text-white hover:bg-zinc-800'
                      : 'bg-zinc-100 text-zinc-800 hover:bg-zinc-200'
                  }`}
                >
                  {p.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  <span>{p.isActive ? 'Active (Click to Close)' : 'Open Session'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-zinc-200 shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-zinc-900">Create Session</h3>
            <form onSubmit={handleAddPeriod} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full template-input"
                  placeholder="e.g. 2025/2026 Second Semester Evaluation"
                />
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
                    <option value="FIRST">First</option>
                    <option value="SECOND">Second</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full template-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full template-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="template-btn-outline">
                  Cancel
                </button>
                <button type="submit" className="template-btn-black">
                  Create Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

