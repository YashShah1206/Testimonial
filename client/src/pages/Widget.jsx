import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getApprovedTestimonials } from '../services/api';
import PublicTestimonialCard from '../components/PublicTestimonialCard';
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

  useEffect(() => {
    const fetchApproved = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getApprovedTestimonials();
        setTestimonials(data);
      } catch (err) {
        console.error('Failed to load widget testimonials:', err);
        setError('Unable to load customer testimonials.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApproved();
  }, []);

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
        <div className={styles.stateContainer}>
          <div className={styles.spinner} />
          <p className={styles.emptyText}>Loading customer proof...</p>
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
        <div className={styles.listContainer}>
          {testimonials.map((item) => (
            <PublicTestimonialCard
              key={item.id}
              testimonial={item}
              accentColor={accentColor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Widget;
