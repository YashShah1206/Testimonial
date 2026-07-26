/**
 * Validates the testimonial submission payload.
 * 
 * Required fields:
 * - name (non-empty string)
 * - email (valid email format)
 * - testimonial (non-empty string)
 * - rating (integer between 1 and 5)
 * 
 * Optional fields: company, photo
 */
const validateTestimonialInput = (data) => {
  const errors = {};

  // Validate Name
  if (!data.name || typeof data.name !== 'string' || data.name.trim() === '') {
    errors.name = 'Customer name is required and cannot be empty.';
  }

  // Validate Email
  if (!data.email || typeof data.email !== 'string' || data.email.trim() === '') {
    errors.email = 'Email address is required.';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.email = 'Please provide a valid email address.';
    }
  }

  // Validate Testimonial Text
  if (!data.testimonial || typeof data.testimonial !== 'string' || data.testimonial.trim() === '') {
    errors.testimonial = 'Testimonial content is required and cannot be empty.';
  }

  // Validate Rating (must be between 1 and 5)
  const numericRating = Number(data.rating);
  if (isNaN(numericRating) || numericRating < 1 || numericRating > 5 || !Number.isInteger(numericRating)) {
    errors.rating = 'Rating must be a whole number between 1 and 5.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateTestimonialInput
};
