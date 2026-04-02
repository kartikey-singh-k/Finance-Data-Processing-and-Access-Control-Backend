// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
    // Log error for debugging
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        url: req.originalUrl,
        method: req.method
    });

    // Default error
    let statusCode = err.statusCode || 500;
    let response = {
        success: false,
        error: {
            code: err.errorCode || 'INTERNAL_SERVER_ERROR',
            message: err.message || 'An unexpected error occurred'
        }
    };

    // Add details for validation errors
    if (err.details) {
        response.error.details = err.details;
    }

    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        response.error.stack = err.stack;
    }

    // Handle specific database errors
    if (err.message?.includes('UNIQUE constraint failed')) {
        statusCode = 409;
        response.error.code = 'DUPLICATE_ENTRY';
        response.error.message = 'A record with this information already exists';
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;