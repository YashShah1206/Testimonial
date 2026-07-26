const express = require('express');
const router = express.Router();
const { submitTestimonial, getAllTestimonials, getApprovedTestimonials, approveTestimonial, rejectTestimonial } = require('../controllers/testimonialController');
const upload = require('../middleware/uploadMiddleware');

// @route   POST /api/testimonials
// @desc    Submit a new customer testimonial
// @access  Public
router.post('/', upload.single('photo'), submitTestimonial);

// @route   GET /api/testimonials/approved
// @desc    Get ONLY approved testimonials (ordered newest first)
// @access  Public (Wall & Widget)
router.get('/approved', getApprovedTestimonials);

// @route   GET /api/testimonials
// @desc    Get all testimonials (ordered newest first)
// @access  Public (Moderation Dashboard)
router.get('/', getAllTestimonials);

// @route   PATCH /api/testimonials/:id/approve
// @desc    Approve a pending testimonial
// @access  Public (Moderation Dashboard)
router.patch('/:id/approve', approveTestimonial);

// @route   PATCH /api/testimonials/:id/reject
// @desc    Reject a pending testimonial
// @access  Public (Moderation Dashboard)
router.patch('/:id/reject', rejectTestimonial);

module.exports = router;
