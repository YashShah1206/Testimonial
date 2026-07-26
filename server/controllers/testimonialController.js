const { PrismaClient } = require('@prisma/client');
const { validateTestimonialInput } = require('../utils/validation');

// Initialize Prisma Client
const prisma = new PrismaClient();

/**
 * @desc    Submit a new testimonial from a customer
 * @route   POST /api/testimonials
 * @access  Public
 */
const submitTestimonial = async (req, res, next) => {
  try {
    // Validate form fields
    const validation = validateTestimonialInput(req.body);

    if (!validation.isValid) {
      // If validation fails, remove uploaded file if one was attached to prevent orphan files
      if (req.file && req.file.path) {
        const fs = require('fs');
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Failed to clean up orphan uploaded photo:', err);
        });
      }

      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please check your inputs.',
        errors: validation.errors
      });
    }

    const { name, email, company, testimonial, rating } = req.body;

    // Determine photo path: use uploaded file path or fallback to text URL if provided
    let photoUrl = null;
    if (req.file && req.file.filename) {
      photoUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.photo && typeof req.body.photo === 'string' && req.body.photo.trim() !== '') {
      photoUrl = req.body.photo.trim();
    }

    // Save testimonial to SQLite database using Prisma ORM
    const newTestimonial = await prisma.testimonial.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        company: company && company.trim() !== '' ? company.trim() : null,
        testimonial: testimonial.trim(),
        rating: Number(rating),
        photo: photoUrl,
        status: 'Pending' // Explicitly enforce Pending status per Task 1 specification
      }
    });

    console.log(`[Testimonial Controller] New submission stored with ID: ${newTestimonial.id} (Status: Pending)`);

    // Return success response with 201 Created status code
    return res.status(201).json({
      success: true,
      message: 'Thank you! Your testimonial has been submitted successfully and is pending review.',
      data: newTestimonial
    });
  } catch (error) {
    console.error('[Testimonial Controller Error]:', error);
    // Pass to global error middleware
    next(error);
  }
};

module.exports = {
  submitTestimonial
};
