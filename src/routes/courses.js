import express from 'express';
import { body } from 'express-validator';
import * as courseController from '../controllers/courseController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.get('/', courseController.getCourses);
router.get('/slug/:slug', courseController.getCourseBySlug);
router.get('/my-courses', authenticate, courseController.getEnrolledCourses);
router.get('/:id', courseController.getCourse);

router.post('/', authenticate, authorize('instructor', 'admin'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('slug').trim().notEmpty().withMessage('Slug is required'),
  body('shortDescription').trim().notEmpty().isLength({ max: 300 }).withMessage('Short description required (max 300 chars)'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['account', 'business', 'economics', 'cuet', 'ca-foundation', 'other']).withMessage('Invalid category'),
  body('grade').isIn(['11', '12', 'cuet', 'ca-foundation']).withMessage('Invalid grade'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be positive'),
  validate
], courseController.createCourse);

router.patch('/:id', authenticate, authorize('instructor', 'admin'), courseController.updateCourse);
router.delete('/:id', authenticate, authorize('instructor', 'admin'), courseController.deleteCourse);

router.post('/:id/purchase', authenticate, courseController.purchaseCourse);
router.post('/:id/enroll', authenticate, courseController.enrollInCourse);
router.patch('/:id/progress', authenticate, courseController.updateProgress);

export default router;