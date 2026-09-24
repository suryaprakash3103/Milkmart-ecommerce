import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 5, reviewCount = null, size = 15 }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.4;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', color: '#D4881E' }}>
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <Star
            key={starIndex}
            size={size}
            fill={starIndex <= fullStars || (starIndex === fullStars + 1 && hasHalf) ? "#D4881E" : "none"}
            stroke="#D4881E"
            strokeWidth={1.75}
          />
        ))}
      </div>
      <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#183626', marginLeft: '2px' }}>
        {Number(rating).toFixed(1)}
      </span>
      {reviewCount !== null && (
        <span style={{ fontSize: '0.78rem', color: '#798C80' }}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
