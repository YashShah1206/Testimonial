import React from 'react';
import styles from './SkeletonLoader.module.css';

const SkeletonLoader = ({ count = 3 }) => {
  return (
    <div className={styles.grid} aria-label="Loading content..." role="status">
      {Array.from({ length: count }, (_, idx) => (
        <div key={idx} className={styles.skeletonCard}>
          <div className={styles.header}>
            <div className={styles.avatar}></div>
            <div className={styles.meta}>
              <div className={styles.lineShort}></div>
              <div className={styles.lineTiny}></div>
            </div>
          </div>
          <div className={styles.stars}></div>
          <div className={styles.body}>
            <div className={styles.line}></div>
            <div className={styles.line}></div>
            <div className={styles.lineMedium}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
