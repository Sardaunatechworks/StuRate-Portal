import React, { useEffect, useState } from 'react';
import { periodApi } from '../../services/api';
import { EvaluationPeriod, PeriodStatus, Semester } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Plus, Calendar, Play, Square, CheckCircle } from 'lucide-react';

export const EvaluationPeriodPage: React.FC = () => {
  const [periods, setPeriods] = useState<EvaluationPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    academicSession: '2025/2026',
    semester: 'FIRST' as Semester,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    status: 'DRAFT' as PeriodStatus,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchPeriods = async () => {
    try {
      setIsLoading(true);
      const list = await periodApi.getAll();
      setPeriods(Array.isArray(list) ? list : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPeriods();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      title: '2025/2026 First Semester Evaluation',
      academicSession: '2025/2026',
      semester: 'FIRST',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      status: 'DRAFT',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setIsSubmitting(true);

    try {
      await periodApi.create({
        title: formData.title,
        academicSession: formData.academicSession,
        semester: formData.semester,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        status: formData.status,
      });
      setSuccessMessage('Evaluation period created successfully.');
      setIsModalOpen(false);
      fetchPeriods();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: PeriodStatus) => {
    try {
      await periodApi.setStatus(id, status);
      setSuccessMessage(`Evaluation period status updated to ${status}.`);
      fetchPeriods();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Evaluation Periods
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure academic evaluation windows and toggle open/closed submission states
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAddModal}
        >
          Create Period
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
          <LoadingSpinner message="Fetching evaluation periods..." />
        ) : (!periods || periods.length === 0) ? (
          <EmptyState
            icon={<Calendar className="w-6 h-6" />}
            title="No Evaluation Periods"
            description="Create an evaluation period to open student evaluation windows."
            actionLabel="Create Period"
            onAction={handleOpenAddModal}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Period Title</th>
                  <th className="py-3 px-4">Academic Session</th>
                  <th className="py-3 px-4">Semester</th>
                  <th className="py-3 px-4">Window Range</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Evaluations</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(periods || []).map((p) => {
                  const currentStatus = p.status || (p.isActive ? 'OPEN' : 'CLOSED');
                  const statusVariant =
                    currentStatus === 'OPEN'
                      ? 'success'
                      : currentStatus === 'CLOSED'
                      ? 'danger'
                      : 'warning';

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {p.title}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-800">
                        {p.academicSession}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="neutral">{p.semester} Semester</Badge>
                      </td>
                      <td className="py-3 px-4 text-slate-600 text-[11px]">
                        {new Date(p.startDate).toLocaleDateString()} -{' '}
                        {new Date(p.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={statusVariant}>{currentStatus}</Badge>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-800">
                        {p._count?.evaluations || 0}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {currentStatus !== 'OPEN' && (
                            <button
                              onClick={() => handleStatusChange(p.id, 'OPEN')}
                              className="px-2 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors flex items-center gap-1"
                              title="Open evaluation period"
                            >
                              <Play className="w-3 h-3" />
                              <span>Open</span>
                            </button>
                          )}
                          {currentStatus === 'OPEN' && (
                            <button
                              onClick={() => handleStatusChange(p.id, 'CLOSED')}
                              className="px-2 py-1 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1"
                              title="Close evaluation period"
                            >
                              <Square className="w-3 h-3" />
                              <span>Close</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Evaluation Period"
        description="Schedule a new evaluation period for student feedback collection"
      >
        {modalError && (
          <AlertBanner type="error" message={modalError} className="mb-4" />
        )}
        <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Period Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              placeholder="e.g. 2025/2026 First Semester Evaluation"
            />
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Initial Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as PeriodStatus })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
            >
              <option value="DRAFT">DRAFT (Not visible to students)</option>
              <option value="OPEN">OPEN (Accepting evaluations)</option>
              <option value="CLOSED">CLOSED (Evaluation concluded)</option>
            </select>
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
              Create Period
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
