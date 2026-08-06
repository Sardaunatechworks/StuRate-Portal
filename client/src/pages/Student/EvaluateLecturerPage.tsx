import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { useModal } from '../../context/ModalContext';
import { RatingStars } from '../../components/RatingStars';
import { ShieldCheck, GraduationCap, Send, CheckCircle2, MessageSquare } from 'lucide-react';

export const EvaluateLecturerPage: React.FC = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<any[]>([]);
  const [courseInfo, setCourseInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { showFeedback } = useModal();

  useEffect(() => {
    Promise.all([
      API.get('/student/questions'),
      API.get('/student/courses')
    ]).then(([qRes, coursesRes]) => {
      setQuestions(qRes.data || []);
      const matched = (coursesRes.data?.courses || []).find((c: any) => c.courseAssignmentId === assignmentId);
      if (matched) {
        setCourseInfo(matched);
      }
    }).catch(err => {
      console.error('Error loading evaluation form data:', err);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [assignmentId]);

  const handleRatingChange = (questionId: string, rating: number) => {
    setRatings(prev => ({ ...prev, [questionId]: rating }));
  };

  const answeredCount = Object.keys(ratings).filter(k => ratings[k] > 0).length;
  const progressPercent = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (answeredCount < questions.length) {
      showFeedback({
        title: 'Incomplete Evaluation Form',
        message: `Please rate all ${questions.length} criteria questions before submitting your evaluation.`,
        type: 'warning'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedRatings = Object.entries(ratings).map(([questionId, rating]) => ({
        questionId,
        rating
      }));

      await API.post('/student/evaluations', {
        courseAssignmentId: assignmentId,
        comment,
        ratings: formattedRatings
      });

      setIsSubmitted(true);
      showFeedback({
        title: 'Evaluation Submitted Successfully',
        message: 'Thank you! Your feedback was recorded completely anonymously.',
        type: 'success'
      });
    } catch (err: any) {
      showFeedback({
        title: 'Submission Error',
        message: err.response?.data?.message || 'Error submitting evaluation.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-xs text-zinc-500">Loading evaluation criteria...</div>;
  }

  if (isSubmitted) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-extrabold text-zinc-900">Evaluation Submitted Successfully!</h2>
        <p className="text-zinc-600 text-sm leading-relaxed">
          Thank you for providing structured feedback for <strong>{courseInfo?.lecturerName || 'your lecturer'}</strong> ({courseInfo?.courseCode || ''}). Your responses have been recorded completely anonymously.
        </p>
        <button
          onClick={() => navigate('/student/courses')}
          className="template-btn-black px-6 py-3"
        >
          Return to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Confidentiality Notice */}
      <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="px-3 py-1 rounded-xl bg-zinc-100 text-zinc-900 font-mono font-bold text-xs border border-zinc-200">
              {courseInfo?.courseCode || 'Course'}
            </span>
            <h1 className="text-xl md:text-2xl font-extrabold text-zinc-900 mt-2">{courseInfo?.courseTitle || 'Lecturer Evaluation'}</h1>
            <p className="text-xs text-zinc-500 mt-1 flex items-center gap-2">
              <GraduationCap size={16} className="text-zinc-900" />
              <span>Lecturer: <strong>{courseInfo?.lecturerName || 'Assigned Lecturer'}</strong> ({courseInfo?.lecturerStaffId || ''})</span>
            </p>
          </div>

          <div className="px-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-xl flex items-center gap-2 text-xs text-zinc-800">
            <ShieldCheck size={18} className="text-black shrink-0" />
            <span><strong>100% Anonymous:</strong> Student identity is never shared with lecturers.</span>
          </div>
        </div>

        {/* Live Progress Bar */}
        <div className="pt-4 border-t border-zinc-100">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-zinc-700">Evaluation Progress</span>
            <span className="text-black font-bold">{answeredCount} of {questions.length} Criteria Completed ({progressPercent}%)</span>
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden border border-zinc-200">
            <div
              className="bg-black h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rating Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
              <div className="space-y-1 max-w-xl">
                <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">{q.category}</span>
                <h4 className="text-sm font-semibold text-zinc-900">{q.questionText}</h4>
              </div>

              <div className="shrink-0 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                <RatingStars
                  value={ratings[q.id] || 0}
                  onChange={(val) => handleRatingChange(q.id, val)}
                  size={26}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Optional Student Comment Box */}
        <div className="bg-white rounded-2xl p-6 border border-zinc-200/80 shadow-sm space-y-3">
          <label className="block text-sm font-extrabold text-zinc-900 flex items-center gap-2">
            <MessageSquare className="text-black" size={18} />
            <span>Optional Student Qualitative Feedback</span>
          </label>
          <p className="text-xs text-zinc-500">
            Provide constructive comments or recommendations regarding course delivery or lecture pace.
          </p>
          <textarea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full template-input p-4"
            placeholder="Type your anonymous feedback here..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || answeredCount < questions.length}
            className="template-btn-black py-3.5 px-8 text-sm flex items-center gap-2 shadow-lg"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <Send size={18} />
                <span>Submit Evaluation Anonymously</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

