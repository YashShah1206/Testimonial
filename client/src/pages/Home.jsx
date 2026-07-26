import React from 'react';
import TestimonialForm from '../components/TestimonialForm';
import styles from './Home.module.css';

const Home = () => {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.mainContent}>
        <section className={styles.hero}>
          <span className={styles.badge}>Customer Feedback</span>
          <h1 className={styles.title}>We Value Your Experience</h1>
          <p className={styles.description}>
            Your feedback helps us continuously improve and innovate. Share your story with us by filling out the brief review below.
          </p>
        </section>

        <section aria-label="Testimonial Submission Form" style={{ width: '100%' }}>
          <TestimonialForm />
        </section>
      </main>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Testimonial Platform. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
