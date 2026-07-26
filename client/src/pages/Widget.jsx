import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getApprovedTestimonials } from '../services/api';
import PublicTestimonialCard from '../components/PublicTestimonialCard';
import SkeletonLoader from '../components/SkeletonLoader';
import Pagination from '../components/Pagination';
import styles from './Widget.module.css';

const Widget = () => {
  const [searchParams] = useSearchParams();
  const accentParam = searchParams.get('accent');
  
  // Format accent color (ensure it starts with # if hex without hash was passed)
  const accentColor = accentParam 
    ? (accentParam.startsWith('#') || accentParam.startsWith('rgb') ? accentParam : `#${accentParam}`)
    : null;

  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const fetchApproved = async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getApprovedTestimonials(page, 3);
      if (res && res.items) {
        setTestimonials(res.items);
        setTotalPages(res.totalPages || 1);
        setTotalItems(res.totalItems || 0);
        setCurrentPage(res.currentPage || page);
      } else if (Array.isArray(res)) {
        setTestimonials(res);
      }
    } catch (err) {
      console.error('Failed to load widget testimonials:', err);
      setError('Unable to load customer testimonials.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApproved(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const containerStyle = {};
  if (accentColor) {
    containerStyle['--widget-accent'] = accentColor;
  }

  return (
    <div className={styles.widgetContainer} style={containerStyle}>
      <div className={styles.widgetHeader}>
        <div className={styles.widgetTitle}>
          <span>Verified Customer Reviews</span>
        </div>
        <span className={styles.badge} style={accentColor ? { background: accentColor, borderColor: accentColor } : {}}>
          ★ Verified Proof
        </span>
      </div>

      {isLoading ? (
        <div style={{ width: '100%', margin: '1rem 0' }}>
          <SkeletonLoader count={3} />
        </div>
      ) : error ? (
        <div className={styles.stateContainer}>
          <p className={styles.emptyText} style={{ color: '#ef4444' }}>{error}</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className={styles.stateContainer}>
          <p className={styles.emptyText}>No approved testimonials to display.</p>
        </div>
      ) : (
        <>
          <div className={styles.listContainer}>
            {testimonials.map((item) => (
              <PublicTestimonialCard
                key={item.id}
                testimonial={item}
                accentColor={accentColor}
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

export default Widget;
