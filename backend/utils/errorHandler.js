// utils/errorHandler.js
export const errorHandler = (err, req, res, next) => {
    console.error('Error caught by errorHandler:', err);

    const statusCode = err.statusCode || err.code || 500;
    const message = err.message || "Internal server error";

    // Don't send response if headers already sent
    if (res.headersSent) {
        return next(err);
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        ...(process.env.NODE_ENV === 'development' && { 
            stack: err.stack,
            error: err 
        })
    });
};