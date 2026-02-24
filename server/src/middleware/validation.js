const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(e => ({
        field: e.path,
        message: e.msg
      }))
    });
  }
  next();
};

const registerValidation = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

const queryValidation = [
  body('query')
    .trim()
    .notEmpty()
    .withMessage('SQL query is required')
    .isLength({ max: 10000 })
    .withMessage('Query cannot exceed 10000 characters'),
  body('assignmentId')
    .notEmpty()
    .withMessage('Assignment ID is required')
    .isMongoId()
    .withMessage('Invalid assignment ID'),
  handleValidationErrors
];

const hintValidation = [
  body('assignmentId')
    .notEmpty()
    .withMessage('Assignment ID is required')
    .isMongoId()
    .withMessage('Invalid assignment ID'),
  body('currentQuery')
    .optional()
    .isString()
    .withMessage('Current query must be a string')
    .isLength({ max: 10000 })
    .withMessage('Query cannot exceed 10000 characters'),
  body('errorMessage')
    .optional()
    .isString()
    .withMessage('Error message must be a string'),
  handleValidationErrors
];

const mongoIdValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid ID format'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  queryValidation,
  hintValidation,
  mongoIdValidation
};
