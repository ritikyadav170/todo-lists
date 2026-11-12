const { errorResponse } = require('../utils/response');

const errorHandler = (err, req, res, next) => {
  console.error('[Error Handler]', err);

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return errorResponse(res, `Resource not found with id ${err.value}`, null, 404);
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    return errorResponse(res, 'Validation error', errors, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    return errorResponse(res, 'Duplicate field value entered', null, 409);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(res, message, null, statusCode);
};

module.exports = errorHandler;
