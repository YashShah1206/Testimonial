import React, { useState } from 'react';
import StarRatingInput from './StarRatingInput';
import { submitTestimonial } from '../services/api';
import styles from './TestimonialForm.module.css';

const TestimonialForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    rating: 0,
    testimonial: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Handle text and textarea changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setSubmitError(null);
  };

  // Handle star rating change
  const handleRatingChange = (newRating) => {
    setFormData((prev) => ({ ...prev, rating: newRating }));
    if (errors.rating) {
      setErrors((prev) => ({ ...prev, rating: null }));
    }
  };

  // Handle photo file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/image\/(jpeg|jpg|png|webp|gif)/)) {
        setErrors((prev) => ({ ...prev, photo: 'Please select a valid image file (JPEG, PNG, WEBP, GIF).' }));
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, photo: 'Image file size must be less than 5MB.' }));
        return;
      }

      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
      if (errors.photo) {
        setErrors((prev) => ({ ...prev, photo: null }));
      }
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    if (photoPreview) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
  };

  // Client-side form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.rating || formData.rating < 1 || formData.rating > 5) {
      newErrors.rating = 'Please select a star rating.';
    }

    if (!formData.testimonial.trim()) {
      newErrors.testimonial = 'Please share your experience with us.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Build FormData payload for multipart submission
      const payload = new FormData();
      payload.append('name', formData.name.trim());
      payload.append('email', formData.email.trim());
      if (formData.company.trim()) {
        payload.append('company', formData.company.trim());
      }
      payload.append('rating', formData.rating);
      payload.append('testimonial', formData.testimonial.trim());
      if (photoFile) {
        payload.append('photo', photoFile);
      }

      // Send to Express API via Axios service
      await submitTestimonial(payload);

      // Show success state
      setSubmitSuccess(true);
      resetForm();
    } catch (err) {
      console.error('Submission Error:', err);
      // Handle API validation errors
      if (err.errors) {
        setErrors(err.errors);
      }
      setSubmitError(err.message || 'Failed to submit testimonial. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      rating: 0,
      testimonial: ''
    });
    removePhoto();
    setErrors({});
  };

  return (
    <div className={styles.card}>
      {submitSuccess ? (
        <div className={styles.successBanner} role="alert">
          <svg style={{ width: '48px', height: '48px', margin: '0 auto', fill: 'var(--success-text)' }} viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--text-primary)' }}>Thank You for Your Feedback!</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Your testimonial has been submitted successfully and is currently pending review by our moderation team.
          </p>
          <button
            type="button"
            className={styles.resetButton}
            onClick={() => setSubmitSuccess(false)}
          >
            Submit Another Testimonial
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {submitError && (
            <div className={styles.errorBanner} role="alert">
              <strong>Error: </strong> {submitError}
            </div>
          )}

          {/* Star Rating Input */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span>Overall Rating *</span>
            </label>
            <StarRatingInput
              value={formData.rating}
              onChange={handleRatingChange}
              error={errors.rating}
            />
            {errors.rating && <span className={styles.errorMessage}>{errors.rating}</span>}
          </div>

          {/* Customer Name */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="name">
              <span>Your Name *</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
              placeholder="e.g. Jane Doe"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.name && <span className={styles.errorMessage}>{errors.name}</span>}
          </div>

          {/* Email Address */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">
              <span>Email Address *</span>
              <span className={styles.optional}>Private (Never shown publicly)</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
              placeholder="e.g. jane@company.com"
              value={formData.email}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
          </div>

          {/* Company Name (Optional) */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="company">
              <span>Company / Role</span>
              <span className={styles.optional}>Optional</span>
            </label>
            <input
              id="company"
              name="company"
              type="text"
              className={styles.input}
              placeholder="e.g. Product Manager at Acme Corp"
              value={formData.company}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
          </div>

          {/* Testimonial Text */}
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="testimonial">
              <span>Your Testimonial *</span>
            </label>
            <textarea
              id="testimonial"
              name="testimonial"
              rows={4}
              className={`${styles.textarea} ${errors.testimonial ? styles.textareaError : ''}`}
              placeholder="What did you love about working with us? How did our product or service help you achieve your goals?"
              value={formData.testimonial}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.testimonial && <span className={styles.errorMessage}>{errors.testimonial}</span>}
          </div>

          {/* Optional Photo Upload */}
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <span>Profile Photo</span>
              <span className={styles.optional}>Optional (Max 5MB)</span>
            </label>
            
            {photoPreview ? (
              <div className={styles.photoPreviewContainer}>
                <img src={photoPreview} alt="Profile preview" className={styles.photoPreview} />
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-primary)' }}>{photoFile?.name}</div>
                  <button
                    type="button"
                    className={styles.removePhotoButton}
                    onClick={removePhoto}
                    disabled={isSubmitting}
                  >
                    Remove Photo
                  </button>
                </div>
              </div>
            ) : (
              <label className={styles.fileUploadArea}>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif"
                  className={styles.fileInput}
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                />
                <span className={styles.uploadButtonLabel}>Choose Image</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Upload a headshot or company logo
                </span>
              </label>
            )}
            {errors.photo && <span className={styles.errorMessage}>{errors.photo}</span>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="spinner" style={{ width: '20px', height: '20px', animation: 'spin 1s linear infinite', fill: 'white' }} viewBox="0 0 24 24">
                  <path d="M12 4V2C6.48 2 2 6.48 2 12h2c0-4.41 3.59-8 8-8z"/>
                </svg>
                <span>Submitting Your Review...</span>
              </>
            ) : (
              <span>Submit Testimonial</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default TestimonialForm;
