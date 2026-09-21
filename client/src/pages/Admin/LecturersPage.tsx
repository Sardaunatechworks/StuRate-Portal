import React, { useEffect, useState } from 'react';
import { lecturerApi, departmentApi } from '../../services/api';
import { LecturerProfile, Department } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Plus, Search, Edit2, Check, X } from 'lucide-react';

export const LecturersPage: React.FC = () => {
  const [lecturers, setLecturers] = useState<LecturerProfile[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLecturer, setEditingLecturer] = useState<LecturerProfile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    staffId: '',
    departmentId: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchLecturers = async () => {
    try {
      setIsLoading(true);
      const [lecturerList, deptList] = await Promise.all([
        lecturerApi.getAll({
          departmentId: deptFilter || undefined,
          search: search || undefined,
        }),
        departmentApi.getAll(),
      ]);
      setLecturers(Array.isArray(lecturerList) ? lecturerList : []);
      setDepartments(Array.isArray(deptList) ? deptList : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, [deptFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLecturers();
  };

  const handleOpenAddModal = () => {
    setEditingLecturer(null);
    setFormData({
      name: '',
      email: '',
      staffId: '',
      departmentId: departments[0]?.id || '',
      password: '',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lec: LecturerProfile) => {
    setEditingLecturer(lec);
    setFormData({
      name: lec.user?.name || '',
      email: lec.user?.email || '',
      staffId: lec.staffId,
      departmentId: lec.departmentId,
      password: '',
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setIsSubmitting(true);

    try {
      if (editingLecturer) {
        await lecturerApi.update(editingLecturer.id, {
          name: formData.name,
          email: formData.email,
          staffId: formData.staffId,
          departmentId: formData.departmentId,
          password: formData.password ? formData.password : undefined,
        });
        setSuccessMessage('Lecturer record updated successfully.');
      } else {
        await lecturerApi.create({
          name: formData.name,
          email: formData.email,
          staffId: formData.staffId,
          departmentId: formData.departmentId,
          password: formData.password || 'Password123!',
        });
        setSuccessMessage('Lecturer account created successfully.');
      }
      setIsModalOpen(false);
      fetchLecturers();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (lec: LecturerProfile) => {
    try {
      const newStatus = !lec.user?.isActive;
      await lecturerApi.update(lec.id, { isActive: newStatus });
      setSuccessMessage(
        `Lecturer account ${newStatus ? 'activated' : 'deactivated'} successfully.`
      );
      fetchLecturers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Academic Staff & Lecturers
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage teaching staff profiles, staff identifiers, and departmental allocations
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAddModal}
        >
          Add Lecturer
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

      {/* Filter and Search */}
      <Card>
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col md:flex-row items-center gap-3"
        >
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by lecturer name, staff ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-600 bg-white text-slate-700"
            >
              <option value="">All Departments</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>

            <Button type="submit" variant="secondary" size="sm">
              Filter
            </Button>
          </div>
        </form>
      </Card>

      {/* Table */}
      <Card>
        {isLoading ? (
          <LoadingSpinner message="Fetching lecturers..." />
        ) : (!lecturers || lecturers.length === 0) ? (
          <EmptyState
            title="No Lecturers Found"
            description="No lecturer records match the specified search or filter criteria."
            actionLabel="Add Lecturer"
            onAction={handleOpenAddModal}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Lecturer</th>
                  <th className="py-3 px-4">Staff ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(lecturers || []).map((lec) => (
                  <tr key={lec.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">
                        {lec.user?.name}
                      </div>
                      <div className="text-slate-500 text-[11px]">{lec.user?.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-medium text-slate-800">
                      {lec.staffId}
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {lec.department?.name || '—'}
                    </td>
                    <td className="py-3 px-4">
                      {lec.user?.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="danger">Inactive</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(lec)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          title="Edit lecturer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(lec)}
                          className={`p-1.5 rounded-lg ${
                            lec.user?.isActive
                              ? 'text-rose-600 hover:bg-rose-50'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={lec.user?.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {lec.user?.isActive ? (
                            <X className="w-3.5 h-3.5" />
                          ) : (
                            <Check className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLecturer ? 'Edit Lecturer Details' : 'Register New Lecturer'}
        description="Enter staff profile and departmental affiliation details"
      >
        {modalError && (
          <AlertBanner type="error" message={modalError} className="mb-4" />
        )}
        <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Full Name (with title) *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              placeholder="e.g. Dr. Alan Turing"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Institutional Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                placeholder="alan.turing@university.edu.ng"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Staff ID *
              </label>
              <input
                type="text"
                required
                value={formData.staffId}
                onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                placeholder="e.g. STF/CSC/001"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Department *
            </label>
            <select
              required
              value={formData.departmentId}
              onChange={(e) =>
                setFormData({ ...formData, departmentId: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              {editingLecturer
                ? 'Change Password (leave blank to keep current)'
                : 'Initial Password *'}
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              placeholder={
                editingLecturer ? '••••••••' : 'Default password (e.g. Password123!)'
              }
              required={!editingLecturer}
            />
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
              {editingLecturer ? 'Save Changes' : 'Create Lecturer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
