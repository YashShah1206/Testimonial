import React, { useState } from 'react';
import { approveTestimonial, rejectTestimonial } from '../services/api';
import styles from './TestimonialCard.module.css';

const API_HOST = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

const TestimonialCard = ({ testimonial, onStatusChange }) => {
  const [status, setStatus] = useState(testimonial.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  // Format created date cleanly
  const formattedDate = new Date(testimonial.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Resolve photo URL (prepend server base URL if relative path)
  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
      return photoPath;
    }
    return `${API_HOST}${photoPath.startsWith('/') ? '' : '/'}${photoPath}`;
  };

  const handleApprove = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      await approveTestimonial(testimonial.id);
      setStatus('Approved');
      if (onStatusChange) onStatusChange(testimonial.id, 'Approved');
    } catch (err) {
      console.error('Approve failed:', err);
      setError(err.message || 'Failed to approve');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReject = async () => {
    setIsUpdating(true);
    setError(null);
    try {
      await rejectTestimonial(testimonial.id);
      setStatus('Rejected');
      if (onStatusChange) onStatusChange(testimonial.id, 'Rejected');
    } catch (err) {
      console.error('Reject failed:', err);
      setError(err.message || 'Failed to reject');
    } finally {
      setIsUpdating(false);
    }
  };

  const renderBadge = () => {
    switch (status) {
      case 'Approved':
        return <span className={`${styles.badge} ${styles.badgeApproved}`}>✓ Approved</span>;
      case 'Rejected':
        return <span className={`${styles.badge} ${styles.badgeRejected}`}>✕ Rejected</span>;
      case 'Pending':
      default:
        return <span className={`${styles.badge} ${styles.badgePending}`}>● Pending</span>;
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.customerInfo}>
          <span className={styles.name}>{testimonial.name}</span>
          <span className={styles.email}>{testimonial.email}</span>
          {testimonial.company && <span className={styles.company}>{testimonial.company}</span>}
          <span className={styles.date}>{formattedDate}</span>
        </div>
        <div>
          {renderBadge()}
        </div>
      </div>

      <div className={styles.stars} aria-label={`${testimonial.rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={styles.starIcon}
            style={{ color: star <= testimonial.rating ? '#fbbf24' : 'rgba(255, 255, 255, 0.15)' }}
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      <div className={styles.contentBody}>
        {testimonial.photo && (
          <img
            src={getPhotoUrl(testimonial.photo)}
            alt={`${testimonial.name} profile`}
            className={styles.photo}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <p className={styles.testimonialText}>"{testimonial.testimonial}"</p>
      </div>

      {error && (
        <div style={{ color: 'var(--error-text)', fontSize: '0.8rem', fontWeight: '500' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Action Buttons: Only show when status is Pending per Task 2 specification */}
      {status === 'Pending' && (
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnApprove}
            onClick={handleApprove}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : '✓ Approve'}
          </button>
          <button
            type="button"
            className={styles.btnReject}
            onClick={handleReject}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : '✕ Reject'}
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialCard;
