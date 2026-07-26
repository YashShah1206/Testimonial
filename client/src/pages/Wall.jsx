import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedTestimonials } from '../services/api';
import PublicTestimonialCard from '../components/PublicTestimonialCard';
import styles from './Wall.module.css';

const Wall = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApproved = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getApprovedTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to load approved testimonials:', err);
      setError(err.message || 'Unable to load public testimonials.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApproved();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>What Our Customers Say</h1>
          <p className={styles.subtitle}>
            Read authentic feedback and success stories from companies and individuals who use our platform every day.
          </p>
        </div>
        <div className={styles.navGroup}>
          <Link to="/" className={styles.navLink}>
            + Submit Review
          </Link>
          <Link to="/dashboard" className={styles.primaryNavLink}>
            Moderation Dashboard →
          </Link>
        </div>
      </header>

      {isLoading ? (
        <div className={styles.stateContainer}>
          <div className={styles.spinner} />
          <p className={styles.emptyText}>Loading customer stories...</p>
        </div>
      ) : error ? (
        <div className={styles.stateContainer} style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <p className={styles.emptyText} style={{ color: 'var(--error-text)' }}>⚠️ Unable to load testimonials</p>
          <p className={styles.emptySubtext}>{error}</p>
          <button
            type="button"
            onClick={fetchApproved}
            style={{
              padding: '0.6rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600'
            }}
          >
            Try Again
          </button>
        </div>
      ) : testimonials.length === 0 ? (
        <div className={styles.stateContainer}>
          <p className={styles.emptyText}>No approved testimonials yet.</p>
          <p className={styles.emptySubtext}>
            Customer reviews submitted through our public form will appear here as soon as they are verified and approved by our team.
          </p>
          <Link
            to="/"
            style={{
              marginTop: '0.75rem',
              padding: '0.7rem 1.5rem',
              background: 'var(--accent-gradient)',
              color: 'white',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600'
            }}
          >
            Be the first to submit a review
          </Link>
        </div>
      ) : (
        <div className={styles.gridContainer}>
          {testimonials.map((item) => (
            <PublicTestimonialCard
              key={item.id}
              testimonial={item}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wall;
