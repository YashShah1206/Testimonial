import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTestimonials } from '../services/api';
import TestimonialCard from '../components/TestimonialCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Pagination from '../components/Pagination';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchTestimonials = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getTestimonials(page, 6);
      if (res && res.items) {
        setTestimonials(res.items);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.totalItems || 0);
        setCurrentPage(res.currentPage || page);
      } else if (Array.isArray(res)) {
        setTestimonials(res);
      }
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      setError(err.message || 'Unable to load testimonials. Please check backend connection.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update local state immediately when a child card is approved or rejected
  const handleStatusChange = (id, newStatus) => {
    setTestimonials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  // Calculate quick stats from loaded items
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
            {totalItems > 0 && <span style={{ marginLeft: '0.5rem', opacity: 0.8 }}>({totalItems} total submissions)</span>}
          </p>
        </div>
        <Link to="/" className={styles.navLink}>
          ← Submission Form
        </Link>
      </header>

      {!isLoading && !error && testimonials.length > 0 && (
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span>Page Pending:</span>
            <span className={styles.statCount} style={{ color: '#fbbf24' }}>{pendingCount}</span>
          </div>
          <div className={styles.statItem}>
            <span>Page Approved:</span>
            <span className={styles.statCount} style={{ color: '#34d399' }}>{approvedCount}</span>
          </div>
          <div className={styles.statItem}>
            <span>Page Rejected:</span>
            <span className={styles.statCount} style={{ color: '#f87171' }}>{rejectedCount}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div style={{ width: '100%', margin: '1rem 0' }}>
          <SkeletonLoader count={6} />
        </div>
      ) : error ? (
        <div className={styles.stateContainer} style={{ borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <p className={styles.emptyText} style={{ color: 'var(--error-text)' }}>⚠️ Error</p>
          <p className={styles.emptySubtext}>{error}</p>
          <button
            type="button"
            onClick={() => fetchTestimonials(currentPage)}
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
          <p className={styles.emptyText}>No testimonials found.</p>
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
        <>
          <div className={styles.listContainer}>
            {testimonials.map((item) => (
              <TestimonialCard
                key={item.id}
                testimonial={item}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
