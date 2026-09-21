import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { studentEvalApi } from '../../services/api';
import { EvaluationQuestion, Semester } from '../../types';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { RatingMatrix } from '../../components/forms/RatingMatrix';
import { LoadingSpinner } from '../../components/feedback/LoadingSpinner';
import { AlertBanner } from '../../components/feedback/AlertBanner';
import {
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

interface AssignmentDetails {
  id: string;
  courseCode: string;
  courseTitle: string;
  creditUnit: number;
  departmentName: string;
  lecturerName: string;
  academicSession: string;
  semester: Semester;
}

export const EvaluateLecturerPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState<AssignmentDetails | null>(null);
  const [periodTitle, setPeriodTitle] = useState<string>('');
  const [questions, setQuestions] = useState<EvaluationQuestion[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comment, setComment] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Review & Submit Confirmation Modal
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  useEffect(() => {
    if (!assignmentId) {
      setError('No course assignment selected.');
      setIsLoading(false);
      return;
    }

    studentEvalApi
      .getFormDetails(assignmentId)
      .then((data) => {
        setAssignment(data.assignment);
        setPeriodTitle(data.period.title);
        setQuestions(data.questions);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  }, [assignmentId]);

  const handleRatingChange = (questionId: string, rating: number) => {
    setRatings((prev) => ({ ...prev, [questionId]: rating }));
    if (validationErrors[questionId]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[questionId];
        return next;
      });
    }
  };

  const handleReviewClick = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    questions.forEach((q) => {
      if (!ratings[q.id]) {
        errors[q.id] = 'Please provide a rating for this criterion.';
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors({});
    setIsReviewModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (!assignmentId || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const payload = {
      courseAssignmentId: assignmentId,
      comment: comment.trim() || undefined,
      ratings: Object.entries(ratings).map(([questionId, rating]) => ({
        questionId,
        rating,
      })),
    };

    try {
      await studentEvalApi.submit(payload);
      setSubmissionSuccess(true);
      setIsReviewModalOpen(false);
    } catch (err: any) {
      setError(err.message);
      setIsReviewModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading evaluation form criteria..." />;
  }

  if (submissionSuccess) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Evaluation Submitted Successfully!
        </h2>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          Your evaluation for <span className="font-semibold text-slate-800">{assignment?.lecturerName}</span> in course <span className="font-semibold text-slate-800">{assignment?.courseCode}</span> has been securely recorded.
        </p>
        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 inline-block font-medium">
          Confidentiality Protected: Your identity is completely shielded from the lecturer.
        </div>
        <div className="pt-4">
          <Button variant="primary" onClick={() => navigate('/student/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="space-y-4 max-w-2xl mx-auto">
        <AlertBanner
          type="error"
          title="Evaluation Unavailable"
          message={error || 'Could not load the requested evaluation.'}
        />
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/student/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Back Button */}
      <Link
        to="/student/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>

      {/* Course & Lecturer Header Banner */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
              Teaching Effectiveness Rating
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-0.5">
              {assignment.courseCode}: {assignment.courseTitle}
            </h1>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {periodTitle}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
          <div>
            <span className="block text-slate-400 text-[10px] uppercase font-bold">
              Lecturer
            </span>
            <span className="font-semibold text-slate-800">
              {assignment.lecturerName}
            </span>
          </div>
          <div>
            <span className="block text-slate-400 text-[10px] uppercase font-bold">
              Department
            </span>
            <span className="font-semibold text-slate-800">
              {assignment.departmentName}
            </span>
          </div>
          <div>
            <span className="block text-slate-400 text-[10px] uppercase font-bold">
              Credit Units
            </span>
            <span className="font-semibold text-slate-800">
              {assignment.creditUnit} Units
            </span>
          </div>
          <div>
            <span className="block text-slate-400 text-[10px] uppercase font-bold">
              Term
            </span>
            <span className="font-semibold text-slate-800">
              {assignment.academicSession} ({assignment.semester})
            </span>
          </div>
        </div>
      </div>

      {/* Confidentiality Notice */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-200 flex items-start gap-3 text-xs shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-white mb-0.5">
            Strict Student Anonymity Statement
          </h4>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            Your evaluation is strictly confidential. The lecturer only sees aggregated rating scores and anonymous comments. Neither your name, email, student ID, nor matriculation number is ever shown to the lecturer.
          </p>
        </div>
      </div>

      {/* Evaluation Form */}
      <form onSubmit={handleReviewClick} className="space-y-6">
        <Card
          title="Teaching Effectiveness Criteria"
          subtitle="Rate the lecturer across all 9 approved academic performance areas"
        >
          {Object.keys(validationErrors).length > 0 && (
            <AlertBanner
              type="warning"
              message="Please provide a rating for all 9 required criteria before proceeding."
              className="mb-6"
            />
          )}

          <RatingMatrix
            questions={questions}
            ratings={ratings}
            onChange={handleRatingChange}
            errors={validationErrors}
          />
        </Card>

        {/* Qualitative Comment */}
        <Card
          title="Constructive Qualitative Feedback (Optional)"
          subtitle="Add any specific observations, suggestions, or comments regarding the lecturer's teaching"
        >
          <div>
            <textarea
              rows={4}
              maxLength={1000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g., The lecturer explains challenging concepts with clarity and uses practical examples, but could provide assignment feedback sooner."
              className="w-full p-3 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 text-slate-900"
            />
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
              <span>This comment will be presented completely anonymously.</span>
              <span>{comment.length} / 1000 characters</span>
            </div>
          </div>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
          <div className="text-xs text-slate-500">
            Ratings completed:{' '}
            <span className="font-bold text-slate-900">
              {Object.keys(ratings).length} of {questions.length}
            </span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={Object.keys(ratings).length < questions.length}
          >
            Review & Submit Evaluation
          </Button>
        </div>
      </form>

      {/* Review Confirmation Modal */}
      <Modal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        title="Confirm Evaluation Submission"
        description="Please review your feedback summary before final submission"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <p className="text-slate-600">
              <span className="font-semibold text-slate-800">Lecturer:</span>{' '}
              {assignment.lecturerName}
            </p>
            <p className="text-slate-600">
              <span className="font-semibold text-slate-800">Course:</span>{' '}
              {assignment.courseCode} - {assignment.courseTitle}
            </p>
            <p className="text-slate-600">
              <span className="font-semibold text-slate-800">All 9 Criteria Rated:</span> Yes
            </p>
            {comment.trim() && (
              <p className="text-slate-600 pt-1 border-t border-slate-200">
                <span className="font-semibold text-slate-800">Comment:</span> “
                {comment.trim()}”
              </p>
            )}
          </div>

          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
            <p className="font-semibold mb-0.5">Important:</p>
            Once submitted, your ratings are permanently finalized and cannot be modified or re-submitted.
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsReviewModalOpen(false)}
              disabled={isSubmitting}
            >
              Back to Edit
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              onClick={handleConfirmSubmit}
            >
              Submit Evaluation Now
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
