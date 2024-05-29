class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message || 'Invalid input data', 400);
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message || 'Not Found', 404);
    }
}

class UnauthorizedError extends AppError {
    constructor(message) {
        super(message || 'Unauthorized', 401);
    }
}

class ForbiddenError extends AppError {
    constructor(message) {
        super(message || 'Forbidden', 403);
    }
}

class ServerError extends AppError {
    constructor(message) {
        super(message || 'Internal Server Error', 500);
    }
}

class ConflictError extends AppError {
    constructor(message) {
        super(message || 'Conflict', 409);
    }
}

const errorHandler = (err, req, res, next) => {
    if (err.isOperational) {
        console.log("error message from handler", err.message)
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        // Log the error
        console.error('ERROR1:', req.url, " : ", err);
        // Send generic message
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
};

module.exports = {
    AppError,
    ValidationError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError,
    ServerError, 
    ConflictError, 
    errorHandler
};
