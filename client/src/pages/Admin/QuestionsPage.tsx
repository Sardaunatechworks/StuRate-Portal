import React, { useEffect, useState } from 'react';
import { questionApi } from '../../services/api';
import { EvaluationQuestion } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';
import { EmptyState } from '../../components/feedback/EmptyState';
import { Plus, Edit2, CheckCircle, Info } from 'lucide-react';

export const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<EvaluationQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<EvaluationQuestion | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    questionText: '',
    order: 1,
    isActive: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const list = await questionApi.getAll();
      setQuestions(list);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormData({
      category: '',
      questionText: '',
      order: questions.length + 1,
      isActive: true,
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q: EvaluationQuestion) => {
    setEditingQuestion(q);
    setFormData({
      category: q.category,
      questionText: q.questionText,
      order: q.order,
      isActive: q.isActive,
    });
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setIsSubmitting(true);

    try {
      if (editingQuestion) {
        await questionApi.update(editingQuestion.id, {
          category: formData.category,
          questionText: formData.questionText,
          order: Number(formData.order),
          isActive: formData.isActive,
        });
        setSuccessMessage('Evaluation question updated successfully.');
      } else {
        await questionApi.create({
          category: formData.category,
          questionText: formData.questionText,
          order: Number(formData.order),
          isActive: formData.isActive,
        });
        setSuccessMessage('Evaluation question added successfully.');
      }
      setIsModalOpen(false);
      fetchQuestions();
    } catch (err: any) {
      setModalError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (q: EvaluationQuestion) => {
    try {
      await questionApi.update(q.id, { isActive: !q.isActive });
      setSuccessMessage(
        `Question ${!q.isActive ? 'activated' : 'deactivated'} successfully.`
      );
      fetchQuestions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Teaching Effectiveness Criteria
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage the approved evaluation criteria questions used across the 5-point rating matrix
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={handleOpenAddModal}
        >
          Add Criterion
        </Button>
      </div>

      {/* Academic standard note */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
        <Info className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
        <p>
          The system evaluates lecturers based on the 9 approved university teaching effectiveness criteria:
          <span className="font-semibold text-slate-800"> Subject Knowledge, Teaching Method, Communication Skills, Punctuality, Course Organization, Student Engagement, Fairness in Assessment, Availability to Students, and Overall Satisfaction.</span>
        </p>
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
          <LoadingSpinner message="Fetching evaluation criteria..." />
        ) : questions.length === 0 ? (
          <EmptyState
            title="No Criteria Configured"
            description="Add evaluation criteria to configure the student evaluation matrix."
            actionLabel="Add Criterion"
            onAction={handleOpenAddModal}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Criterion Category</th>
                  <th className="py-3 px-4">Evaluation Question Text</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {questions.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-400">
                      {q.order}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {q.category}
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-md">
                      {q.questionText}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {q.isActive ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="neutral">Inactive</Badge>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(q)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          title="Edit question"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(q)}
                          className={`text-xs px-2 py-1 rounded font-medium border ${
                            q.isActive
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {q.isActive ? 'Deactivate' : 'Activate'}
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

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingQuestion ? 'Edit Criterion' : 'Add Evaluation Criterion'}
        description="Enter the evaluation question wording and criterion grouping"
      >
        {modalError && (
          <AlertBanner type="error" message={modalError} className="mb-4" />
        )}
        <form onSubmit={handleModalSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category / Heading *
              </label>
              <input
                type="text"
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                placeholder="e.g. Subject Knowledge"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Display Order *
              </label>
              <input
                type="number"
                min={1}
                required
                value={formData.order}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value, 10) })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Evaluation Question Text *
            </label>
            <textarea
              required
              rows={3}
              value={formData.questionText}
              onChange={(e) =>
                setFormData({ ...formData, questionText: e.target.value })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
              placeholder="e.g. Demonstrates in-depth subject knowledge and mastery of course concepts."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
              className="rounded text-emerald-700 focus:ring-emerald-600"
            />
            <label htmlFor="isActive" className="font-semibold text-slate-700">
              Active in Student Evaluation Matrix
            </label>
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
              {editingQuestion ? 'Save Changes' : 'Create Criterion'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
