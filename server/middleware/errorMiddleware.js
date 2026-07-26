/**
 * Global Error Handling Middleware for Express
 * 
 * Captures synchronous and asynchronous errors and returns a structured JSON error response.
 */
const errorHandler = (err, req, res, next) => {
  console.error('[Error Middleware]:', err.message || err);

  // If status code is already set (and not 200), use it; otherwise default to 500
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  // Handle Multer upload errors specifically
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File upload error: The uploaded photo exceeds the 5MB size limit.',
      });
    }
    return res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
  }

  // Handle custom validation or syntax errors
  if (err.message && err.message.includes('Invalid image file format')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred.',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

/**
 * Handle 404 Not Found errors for unmatched routes
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - API Endpoint does not exist: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler
};
