import { validationResult, body } from 'express-validator';

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

export const validateRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain uppercase, lowercase, number, and special character'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  body('grade').optional().isIn(['11', '12', 'cuet', 'ca-foundation', 'other']),
  body('board').optional().isIn(['CBSE', 'ICSE', 'State Board', 'Other']),
  validate
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
];

export const validateCourse = [
  body('title').trim().notEmpty().withMessage('Course title is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('shortDescription').trim().notEmpty().isLength({ max: 300 }).withMessage('Short description required (max 300 chars)'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['account', 'business', 'economics', 'cuet', 'ca-foundation', 'other']).withMessage('Invalid category'),
  body('grade').isIn(['11', '12', 'cuet', 'ca-foundation']).withMessage('Invalid grade'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('originalPrice').optional().isFloat({ min: 0 }),
  validate
];

export const validateLiveStream = [
  body('title').trim().notEmpty().withMessage('Stream title is required'),
  body('scheduledAt').isISO8601().withMessage('Valid scheduled date is required'),
  body('estimatedDuration').optional().isInt({ min: 1 }),
  body('requiredMembership').optional().isIn(['free', 'basic', 'premium', 'vip']),
  validate
];