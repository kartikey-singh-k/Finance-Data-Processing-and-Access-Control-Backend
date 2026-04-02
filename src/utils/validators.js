const { body, param, query, validationResult } = require('express-validator');
const { ValidationError } = require('./customErrors');

// Middleware to check validation results
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const details = errors.array().map(err => ({
            field: err.path || err.param,
            message: err.msg,
            value: err.value
        }));
        throw new ValidationError('Validation failed', details);
    }
    next();
};

// Auth Validators
const registerValidator = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 })
        .withMessage('Username must be between 3 and 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('role')
        .isIn(['Viewer', 'Analyst', 'Admin'])
        .withMessage('Role must be Viewer, Analyst, or Admin'),
    validate
];

const loginValidator = [
    body('username').trim().notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
];

// Record Validators
const createRecordValidator = [
    body('amount')
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a positive number'),
    body('type')
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isLength({ max: 100 })
        .withMessage('Category must not exceed 100 characters'),
    body('date')
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date'),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters'),
    validate
];

const updateRecordValidator = [
    param('id').isInt({ min: 1 }).withMessage('Invalid record ID'),
    body('amount')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Amount must be a positive number'),
    body('type')
        .optional()
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    body('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Category must be between 1 and 100 characters'),
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date'),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Notes must not exceed 500 characters'),
    validate
];

const deleteRecordValidator = [
    param('id').isInt({ min: 1 }).withMessage('Invalid record ID'),
    validate
];

const getRecordsValidator = [
    query('type')
        .optional()
        .isIn(['income', 'expense'])
        .withMessage('Type must be either income or expense'),
    query('category')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Category must not exceed 100 characters'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    validate
];

module.exports = {
    validate,
    registerValidator,
    loginValidator,
    createRecordValidator,
    updateRecordValidator,
    deleteRecordValidator,
    getRecordsValidator
};