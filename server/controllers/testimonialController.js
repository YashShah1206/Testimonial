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

/**
 * @desc    Get all submitted testimonials ordered by newest first
 * @route   GET /api/testimonials
 * @access  Public (Moderation Dashboard)
 */
const getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials
    });
  } catch (error) {
    console.error('[Testimonial Controller - Get All Error]:', error);
    next(error);
  }
};

/**
 * @desc    Approve a pending testimonial
 * @route   PATCH /api/testimonials/:id/approve
 * @access  Public (Moderation Dashboard)
 */
const approveTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if testimonial exists
    const existing = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Testimonial with ID ${id} not found.`
      });
    }

    // Update status to Approved
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: { status: 'Approved' }
    });

    console.log(`[Testimonial Controller] Testimonial ${id} status updated to: Approved`);

    return res.status(200).json({
      success: true,
      message: 'Testimonial approved successfully.',
      data: updatedTestimonial
    });
  } catch (error) {
    console.error('[Testimonial Controller - Approve Error]:', error);
    next(error);
  }
};

/**
 * @desc    Reject a pending testimonial
 * @route   PATCH /api/testimonials/:id/reject
 * @access  Public (Moderation Dashboard)
 */
const rejectTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if testimonial exists
    const existing = await prisma.testimonial.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: `Testimonial with ID ${id} not found.`
      });
    }

    // Update status to Rejected
    const updatedTestimonial = await prisma.testimonial.update({
      where: { id },
      data: { status: 'Rejected' }
    });

    console.log(`[Testimonial Controller] Testimonial ${id} status updated to: Rejected`);

    return res.status(200).json({
      success: true,
      message: 'Testimonial rejected successfully.',
      data: updatedTestimonial
    });
  } catch (error) {
    console.error('[Testimonial Controller - Reject Error]:', error);
    next(error);
  }
};

module.exports = {
  submitTestimonial,
  getAllTestimonials,
  approveTestimonial,
  rejectTestimonial
};
