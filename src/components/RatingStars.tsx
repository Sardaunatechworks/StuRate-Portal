import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  value: number;
  onChange?: (val: number) => void;
  readOnly?: boolean;
  size?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 24,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= displayValue;
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHoverValue(star)}
            onMouseLeave={() => !readOnly && setHoverValue(null)}
            className={`transition-all transform ${
              !readOnly ? 'hover:scale-125 cursor-pointer focus:outline-none' : 'cursor-default'
            }`}
          >
            <Star
              size={size}
              className={`${
                isFilled
                  ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                  : 'text-slate-600 fill-slate-800'
              } transition-colors duration-200`}
            />
          </button>
        );
      })}
      {value > 0 && readOnly && (
        <span className="ml-2 text-sm font-semibold text-amber-400">{value.toFixed(1)}</span>
      )}
    </div>
  );
};
