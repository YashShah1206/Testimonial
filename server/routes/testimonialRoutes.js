const express = require('express');
const router = express.Router();
const { submitTestimonial } = require('../controllers/testimonialController');
const upload = require('../middleware/uploadMiddleware');

// @route   POST /api/testimonials
// @desc    Submit a new customer testimonial
// @access  Public
router.post('/', upload.single('photo'), submitTestimonial);

module.exports = router;
