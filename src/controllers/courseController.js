import Course from '../models/Course.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { createProduct, createPrice, createCheckoutSession } from '../services/stripe.js';
import { sendOrderConfirmationEmail } from '../services/email.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';
import { config } from '../config/index.js';

export const getCourses = catchAsync(async (req, res, next) => {
  const { category, grade, search, page = 1, limit = 12, sort = '-createdAt' } = req.query;
  const query = { isPublished: true };
  if (category) query.category = category;
  if (grade) query.grade = grade;
  if (search) query.$text = { $search: search };

  const courses = await Course.find(query).populate('instructor', 'firstName lastName avatar').sort(sort).skip((page - 1) * limit).limit(parseInt(limit));
  const total = await Course.countDocuments(query);
  res.json({ success: true, courses, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
});
export const getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate('instructor', 'firstName lastName avatar email');
  if (!course) return next(new AppError('Course not found', 404));

  let isEnrolled = false, userProgress = null;
  if (req.user) {
    const enrollment = req.user.enrolledCourses.find(e => e.course.toString() === course._id.toString());
    isEnrolled = !!enrollment;
    if (enrollment) userProgress = enrollment;
  }
  res.json({ success: true, course, isEnrolled, userProgress });
});

export const getCourseBySlug = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({ slug: req.params.slug, isPublished: true }).populate('instructor', 'firstName lastName avatar email');
  if (!course) return next(new AppError('Course not found', 404));

  let isEnrolled = false, userProgress = null;
  if (req.user) {
    const enrollment = req.user.enrolledCourses.find(e => e.course.toString() === course._id.toString());
    isEnrolled = !!enrollment;
    if (enrollment) userProgress = enrollment;
  }
  res.json({ success: true, course, isEnrolled, userProgress });
});

export const createCourse = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') return next(new AppError('Only instructors can create courses', 403));
  const course = await Course.create({ ...req.body, instructor: req.user.id });
  const stripeProduct = await createProduct(course.title, course.shortDescription, { courseId: course._id.toString() });
  const stripePrice = await createPrice(stripeProduct.id, course.price, 'inr', null, { courseId: course._id.toString() });
  course.stripeProductId = stripeProduct.id; course.stripePriceId = stripePrice.id; await course.save();
  res.status(201).json({ success: true, message: 'Course created', course });
});

export const updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') return next(new AppError('Not authorized', 403));
  Object.assign(course, req.body); await course.save();
  res.json({ success: true, message: 'Course updated', course });
});

export const deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));
  if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') return next(new AppError('Not authorized', 403));
  await course.deleteOne(); res.json({ success: true, message: 'Course deleted' });
});
const createStripeCustomer = async (user) => {
  const { createCustomer } = await import('../services/stripe.js');
  const customer = await createCustomer(user.email, `${user.firstName} ${user.lastName}`, { userId: user._id.toString() });
  user.membership.stripeCustomerId = customer.id;
  await user.save({ validateBeforeSave: false });
  return customer;
};

export const purchaseCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError('Course not found', 404));

  const isEnrolled = req.user.enrolledCourses.some(e => e.course.toString() === course._id.toString());
  if (isEnrolled) return next(new AppError('Already enrolled', 400));

  const customer = req.user.membership.stripeCustomerId ? { id: req.user.membership.stripeCustomerId } : await createStripeCustomer(req.user);
  const session = await createCheckoutSession({
    customerId: customer.id,
    lineItems: [{ price: course.stripePriceId, quantity: 1 }],
    successUrl: `${config.clientUrl}/courses/${course.slug}?success=true`,
    cancelUrl: `${config.clientUrl}/courses/${course.slug}?canceled=true`,
    mode: 'payment',
    metadata: { courseId: course._id.toString(), userId: req.user.id }
  });
  res.json({ success: true, sessionId: session.id, url: session.url });
});

export const enrollInCourse = catchAsync(async (req, res, next) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  if (!course) return next(new AppError('Course not found', 404));

  const isEnrolled = req.user.enrolledCourses.some(e => e.course.toString() === courseId);
  if (isEnrolled) return next(new AppError('Already enrolled', 400));

  req.user.enrolledCourses.push({ course: courseId, enrolledAt: new Date(), progress: 0, completedLessons: [] });
  course.enrollmentCount += 1;
  await Promise.all([req.user.save(), course.save()]);
  res.json({ success: true, message: 'Enrolled successfully' });
});

export const updateProgress = catchAsync(async (req, res, next) => {
  const { courseId, lessonId } = req.body;
  const enrollment = req.user.enrolledCourses.find(e => e.course.toString() === courseId);
  if (!enrollment) return next(new AppError('Not enrolled', 400));

  if (!enrollment.completedLessons.includes(lessonId)) enrollment.completedLessons.push(lessonId);

  const course = await Course.findById(courseId);
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  enrollment.progress = Math.round((enrollment.completedLessons.length / totalLessons) * 100);

  await req.user.save();
  res.json({ success: true, progress: enrollment.progress });
});

export const getEnrolledCourses = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate('enrolledCourses.course');
  res.json({ success: true, courses: user.enrolledCourses });
});