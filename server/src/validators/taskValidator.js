const { body, query, validationResult } = require('express-validator');
const { errorResponse } = require('../utils/response');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(
      res,
      'Validation error',
      errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
      400
    );
  }
  next();
};

const createTaskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ max: 120 })
    .withMessage('Task title cannot exceed 120 characters'),
  body('dueAt')
    .notEmpty()
    .withMessage('Due date is required')
    .isISO8601()
    .withMessage('Due date must be a valid ISO-8601 date string'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('status')
    .optional()
    .isIn(['In Progress', 'Completed'])
    .withMessage('Status must be In Progress or Completed'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('startTime')
    .optional()
    .isString()
    .withMessage('Start time must be a string'),
  body('endTime')
    .optional()
    .isString()
    .withMessage('End time must be a string'),
  validate,
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Task title cannot be empty')
    .isLength({ max: 120 })
    .withMessage('Task title cannot exceed 120 characters'),
  body('dueAt')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid ISO-8601 date string'),
  body('priority')
    .optional()
    .isIn(['Low', 'Medium', 'High'])
    .withMessage('Priority must be Low, Medium, or High'),
  body('status')
    .optional()
    .isIn(['In Progress', 'Completed'])
    .withMessage('Status must be In Progress or Completed'),
  body('description')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('startTime')
    .optional()
    .isString()
    .withMessage('Start time must be a string'),
  body('endTime')
    .optional()
    .isString()
    .withMessage('End time must be a string'),
  validate,
];

const updateStatusValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['In Progress', 'Completed'])
    .withMessage('Status must be In Progress or Completed'),
  validate,
];

module.exports = {
  createTaskValidation,
  updateTaskValidation,
  updateStatusValidation,
};
