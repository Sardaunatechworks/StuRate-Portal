import React from 'react';
import { EvaluationQuestion } from '../../types';

interface RatingMatrixProps {
  questions: EvaluationQuestion[];
  ratings: Record<string, number>;
  onChange: (questionId: string, rating: number) => void;
  errors?: Record<string, string>;
}

export const RatingMatrix: React.FC<RatingMatrixProps> = ({
  questions,
  ratings,
  onChange,
  errors = {},
}) => {
  const scaleOptions = [
    { value: 1, label: 'Very Poor', short: '1' },
    { value: 2, label: 'Poor', short: '2' },
    { value: 3, label: 'Average', short: '3' },
    { value: 4, label: 'Good', short: '4' },
    { value: 5, label: 'Excellent', short: '5' },
  ];

  return (
    <div className="space-y-6">
      {/* Legend header */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-3">
        <span className="font-semibold text-slate-800">Rating Scale Reference:</span>
        <div className="flex flex-wrap items-center gap-4">
          {scaleOptions.map((opt) => (
            <div key={opt.value} className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px]">
                {opt.value}
              </span>
              <span>= {opt.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Criteria list */}
      <div className="divide-y divide-slate-100 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {questions.map((q, idx) => {
          const currentRating = ratings[q.id];
          const hasError = errors[q.id];

          return (
            <div
              key={q.id}
              className={`p-5 transition-colors ${
                hasError
                  ? 'bg-rose-50/50'
                  : currentRating
                  ? 'bg-slate-50/30'
                  : 'hover:bg-slate-50/50'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-900">
                      {q.category}
                    </h4>
                    <span className="text-rose-500 font-bold text-xs" title="Required">
                      *
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 pl-7">{q.questionText}</p>
                  {hasError && (
                    <p className="text-xs text-rose-600 font-medium pl-7 mt-1">
                      {hasError}
                    </p>
                  )}
                </div>

                {/* 5-Point Selector */}
                <div className="flex items-center gap-2 pl-7 lg:pl-0">
                  {scaleOptions.map((opt) => {
                    const isSelected = currentRating === opt.value;
                    return (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => onChange(q.id, opt.value)}
                        className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 ${
                          isSelected
                            ? 'bg-emerald-700 text-white font-bold shadow-md shadow-emerald-700/20 scale-105'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                        aria-pressed={isSelected}
                        aria-label={`${q.category}: ${opt.value} - ${opt.label}`}
                      >
                        <span className="text-base font-bold leading-none">
                          {opt.value}
                        </span>
                        <span className="text-[9px] mt-0.5 opacity-90 truncate max-w-[42px]">
                          {opt.label.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
