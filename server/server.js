require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const testimonialRoutes = require('./routes/testimonialRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');

// Initialize Express application
const app = express();

// ==========================================
// MIDDLEWARE CONFIGURATION
// ==========================================

// Enable Cross-Origin Resource Sharing (CORS) for frontend client
app.use(cors({
  origin: true, // Allow any frontend origin (Vercel, local dev, or third-party iframe embeds)
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));

// Enable parsing of JSON payloads
app.use(express.json());

// Enable parsing of URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Serve static photo uploads from the server/uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// API ROUTES
// ==========================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Testimonial API server is running smoothly.' });
});

// Mount testimonial routes
app.use('/api/testimonials', testimonialRoutes);

// ==========================================
// ERROR HANDLING
// ==========================================

// Handle 404 unmatched routes
app.use(notFoundHandler);

// Global error handler middleware
app.use(errorHandler);

// ==========================================
// SERVER LAUNCH
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  console.log(`🔗 API Endpoint: http://localhost:${PORT}/api/testimonials`);
  console.log(`==================================================`);
});

module.exports = app;
