import React, { useState } from 'react';
import styles from './StarRatingInput.module.css';

const RATING_LABELS = {
  1: '1 star – Poor experience',
  2: '2 stars – Fair, needs improvement',
  3: '3 stars – Good, average service',
  4: '4 stars – Very good, highly satisfied',
  5: '5 stars – Excellent! Exceeded expectations!'
};

const StarRatingInput = ({ value, onChange, error }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const currentDisplayRating = hoverRating || value;

  return (
    <div className={styles.ratingContainer}>
      <div className={styles.starsWrapper} role="radiogroup" aria-label="Star Rating">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= currentDisplayRating;
          return (
            <button
              key={star}
              type="button"
              role="radio"
              aria-checked={value === star}
              aria-label={`${star} Star${star > 1 ? 's' : ''}`}
              className={`${styles.starButton} ${isFilled ? styles.starFilled : ''}`}
              onClick={() => onChange(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onFocus={() => setHoverRating(star)}
              onBlur={() => setHoverRating(0)}
            >
              <svg className={styles.starIcon} viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </button>
          );
        })}
      </div>
      <div className={styles.ratingLabel}>
        {currentDisplayRating ? RATING_LABELS[currentDisplayRating] : 'Select your rating (1 to 5 stars)'}
      </div>
    </div>
  );
};

export default StarRatingInput;
