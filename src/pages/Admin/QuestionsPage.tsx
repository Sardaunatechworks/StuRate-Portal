import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { useModal } from '../../context/ModalContext';
import { HelpCircle, Plus, Trash2, CheckCircle, XCircle } from 'lucide-react';

export const QuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    questionText: '',
    category: 'Pedagogy',
    order: 1
  });

  const { showFeedback, showConfirm } = useModal();

  const fetchQuestions = async () => {
    try {
      const res = await API.get('/admin/questions');
      setQuestions(res.data);
      setFormData(prev => ({ ...prev, order: res.data.length + 1 }));
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/admin/questions', {
        questionText: formData.questionText,
        category: formData.category,
        order: Number(formData.order),
        isActive: true
      });
      setIsModalOpen(false);
      setFormData({ questionText: '', category: 'Pedagogy', order: questions.length + 2 });
      fetchQuestions();
      showFeedback({
        title: 'Criterion Added',
        message: 'Evaluation criteria question was added successfully.',
        type: 'success'
      });
    } catch (err: any) {
      showFeedback({
        title: 'Error Adding Criterion',
        message: err.response?.data?.message || 'Error creating question',
        type: 'error'
      });
    }
  };

  const toggleActive = async (q: any) => {
    try {
      await API.put(`/admin/questions/${q.id}`, {
        ...q,
        isActive: !q.isActive
      });
      fetchQuestions();
      showFeedback({
        title: 'Status Updated',
        message: `Question status changed to ${!q.isActive ? 'Active' : 'Inactive'}.`,
        type: 'success'
      });
    } catch (err: any) {
      showFeedback({
        title: 'Update Failed',
        message: err.response?.data?.message || 'Error updating question',
        type: 'error'
      });
    }
  };

  const handleDelete = (id: string, text: string) => {
    showConfirm({
      title: 'Confirm Question Deletion',
      message: `Are you sure you want to delete this criterion: "${text}"?`,
      confirmLabel: 'Delete Criterion',
      onConfirm: async () => {
        try {
          await API.delete(`/admin/questions/${id}`);
          fetchQuestions();
          showFeedback({
            title: 'Criterion Deleted',
            message: 'Evaluation criterion was deleted successfully.',
            type: 'success'
          });
        } catch (err: any) {
          showFeedback({
            title: 'Delete Failed',
            message: err.response?.data?.message || 'Error deleting question',
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
          <h1 className="text-2xl font-extrabold text-zinc-900 tracking-tight">Criteria Questions</h1>
          <p className="text-xs text-zinc-500 mt-1">Manage the 5-point scale rating criteria presented to students.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="template-btn-black flex items-center gap-2">
          <Plus size={16} />
          <span>Add Question</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-sm overflow-hidden divide-y divide-zinc-200/60">
        {isLoading ? (
          <p className="text-xs text-zinc-500 p-6">Loading criteria questions...</p>
        ) : questions.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs">
            No questions defined. Click "Add Question" to create one.
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="p-5 flex items-start justify-between gap-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-xl bg-black text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  #{q.order}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 leading-relaxed">{q.questionText}</h4>
                  <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-zinc-200 text-[11px] font-semibold">
                    {q.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => toggleActive(q)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    q.isActive
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                  }`}
                >
                  {q.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                  <span>{q.isActive ? 'Active' : 'Disabled'}</span>
                </button>
                <button
                  onClick={() => handleDelete(q.id, q.questionText)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-zinc-200 shadow-xl space-y-4">
            <h3 className="text-lg font-extrabold text-zinc-900">Add Rating Question</h3>
            <form onSubmit={handleAddQuestion} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 mb-1">Question Text</label>
                <textarea
                  rows={3}
                  required
                  value={formData.questionText}
                  onChange={e => setFormData({ ...formData, questionText: e.target.value })}
                  className="w-full template-input"
                  placeholder="e.g. Communication Skills: Explains concepts clearly..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full template-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    required
                    value={formData.order}
                    onChange={e => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full template-input"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="template-btn-outline">
                  Cancel
                </button>
                <button type="submit" className="template-btn-black">
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

