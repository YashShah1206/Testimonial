import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTestimonials } from '../services/api';
import TestimonialCard from '../components/TestimonialCard';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      setError(err.message || 'Unable to load testimonials. Please check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Update local state immediately when a child card is approved or rejected
  const handleStatusChange = (id, newStatus) => {
    setTestimonials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  // Calculate quick stats
  const pendingCount = testimonials.filter((t) => t.status === 'Pending').length;
  const approvedCount = testimonials.filter((t) => t.status === 'Approved').length;
  const rejectedCount = testimonials.filter((t) => t.status === 'Rejected').length;

  return (
    <div className={styles.pageContainer}>
      <header className={styles.header}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Moderation Dashboard</h1>
          <p className={styles.subtitle}>
            Review customer feedback. Approve reviews to display them publicly or reject unwanted submissions.
          </p>
        </div>
        <Link to="/" className={styles.navLink}>
          ← Submission Form
        </Link>
      </header>

      {!isLoading && !error && testimonials.length > 0 && (
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span>Pending:</span>
            <span className={styles.statCount} style={{ color: '#fbbf24' }}>{pendingCount}</span>
          </div>
          <div className={styles.statItem}>
            <span>Approved:</span>
            <span className={styles.statCount} style={{ color: '#34d399' }}>{approvedCount}</span>
          </div>
          <div className={styles.statItem}>
            <span>Rejected:</span>
            <span className={styles.statCount} style={{ color: '#f87171' }}>{rejectedCount}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className={styles.stateContainer}>
          <div className={styles.spinner} />
          <p className={styles.emptyText}>Loading customer testimonials...</p>
        </div>
      ) : error ? (
        <div className={styles.stateContainer} style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <p className={styles.emptyText} style={{ color: 'var(--error-text)' }}>⚠️ Error</p>
          <p className={styles.emptySubtext}>{error}</p>
          <button
            type="button"
            onClick={fetchTestimonials}
            style={{
              padding: '0.6rem 1.2rem',
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
          <p className={styles.emptyText}>No testimonials submitted yet.</p>
          <p className={styles.emptySubtext}>
            Once customers submit reviews through the public form, they will appear here for review.
          </p>
          <Link
            to="/"
            style={{
              marginTop: '0.5rem',
              padding: '0.65rem 1.25rem',
              background: 'var(--accent-gradient)',
              color: 'white',
              borderRadius: 'var(--radius-sm)',
              fontWeight: '600'
            }}
          >
            Go to Submission Form
          </Link>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {testimonials.map((item) => (
            <TestimonialCard
              key={item.id}
              testimonial={item}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
