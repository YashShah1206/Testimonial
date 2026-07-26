import React from 'react';
import styles from './Pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate page numbers
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className={styles.pagination} aria-label="Pagination navigation">
      <button
        type="button"
        className={styles.pageBtn}
        onClick={handlePrevious}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      <div className={styles.pageNumbers}>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`${styles.numberBtn} ${page === currentPage ? styles.active : ''}`}
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={styles.pageBtn}
        onClick={handleNext}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
};

export default Pagination;
