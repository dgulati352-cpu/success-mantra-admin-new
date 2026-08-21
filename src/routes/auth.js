import express from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

const prepareRegister = (req, res, next) => {
  if (req.body.name && (!req.body.firstName || !req.body.lastName)) {
    const parts = req.body.name.trim().split(/\s+/);
    req.body.firstName = req.body.firstName || parts[0] || 'User';
    req.body.lastName = req.body.lastName || parts.slice(1).join(' ') || '.';
  }
  next();
};

router.post('/register', [
  prepareRegister,
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstName').trim().notEmpty().withMessage('First name is required'),
  body('lastName').trim().notEmpty().withMessage('Last name is required'),
  validate
], authController.register);

router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], authController.login);

router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.get('/me', authenticate, authController.getMe);
router.get('/verify-email/:token', authController.verifyEmail);

router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  validate
], authController.forgotPassword);

router.post('/reset-password/:token', [
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('Password must contain uppercase, lowercase, number, and special character'),
  validate
], authController.resetPassword);

router.patch('/profile', authenticate, [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('grade').optional().isIn(['11', '12', 'cuet', 'ca-foundation', 'other']),
  body('board').optional().isIn(['CBSE', 'ICSE', 'State Board', 'Other']),
  validate
], authController.updateProfile);

router.patch('/change-password', authenticate, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/).withMessage('Password must contain uppercase, lowercase, number, and special character'),
  validate
], authController.changePassword);

export default router;