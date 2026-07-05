'use client';

import { getRating, setRating } from '@/lib/storage';
import { useState, useEffect } from 'react';

export default function RatingComponent({ promptId }: { promptId: string }) {
  const [rating, setLocalRating] = useState<number | null>(null);
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  useEffect(() => {
    setLocalRating(getRating(promptId));
  }, [promptId]);

  const handleRate = (value: number) => {
    setRating(promptId, value);
    setLocalRating(value);
  };

  const displayRating = hoverRating || rating || 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600 dark:text-slate-400">Rate:</span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(null)}
            className="text-2xl hover:scale-110 transition-transform"
          >
            {star <= displayRating ? '⭐' : '☆'}
          </button>
        ))}
      </div>
      {rating && <span className="text-sm text-slate-500 dark:text-slate-400">({rating}/5)</span>}
    </div>
  );
}
