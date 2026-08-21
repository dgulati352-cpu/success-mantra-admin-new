import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { generateTokens, setTokenCookies, clearTokenCookies } from '../middleware/auth.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../services/email.js';
import { config } from '../config/index.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';

const hashPassword = async (password) => bcrypt.hash(password, 12);
const comparePasswords = async (password, hashedPassword) => bcrypt.compare(password, hashedPassword);

export const register = catchAsync(async (req, res, next) => {
  let { email, password, firstName, lastName, name, grade, board } = req.body;

  if (name && (!firstName || !lastName)) {
    const parts = name.trim().split(/\s+/);
    firstName = firstName || parts[0] || 'User';
    lastName = lastName || parts.slice(1).join(' ') || '.';
  }
  if (!firstName) firstName = 'User';
  if (!lastName) lastName = '.';

  const existingUser = await User.findOne({ email });
  if (existingUser) return next(new AppError('Email already registered', 400));

  const hashedPassword = await hashPassword(password);
  const emailVerificationToken = crypto.randomBytes(32).toString('hex');
  const emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

  const user = await User.create({
    email, password: hashedPassword, firstName, lastName,
    grade: grade || '11', board: board || 'CBSE',
    emailVerificationToken, emailVerificationExpires
  });

  const verificationUrl = `${config.clientUrl}/verify-email/${emailVerificationToken}`;
  try {
    await sendWelcomeEmail(user, verificationUrl);
  } catch (emailErr) {
    console.error('Welcome email dispatch failed (non-fatal):', emailErr.message);
  }

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);

  res.status(201).json({
    success: true,
    message: 'Registration successful! Please check your email to verify your account.',
    user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, grade: user.grade, board: user.board, membership: user.membership, isEmailVerified: user.isEmailVerified }
  });
});
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user) return next(new AppError('Invalid email or password', 401));

  const isPasswordCorrect = await comparePasswords(password, user.password);
  if (!isPasswordCorrect) return next(new AppError('Invalid email or password', 401));

  if (!user.isActive) return next(new AppError('Account is deactivated. Contact support.', 401));

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);

  res.json({
    success: true,
    message: 'Login successful',
    user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, grade: user.grade, board: user.board, avatar: user.avatar, membership: user.membership, isEmailVerified: user.isEmailVerified }
  });
});

export const logout = catchAsync(async (req, res, next) => {
  if (req.user) { req.user.refreshToken = null; await req.user.save({ validateBeforeSave: false }); }
  clearTokenCookies(res);
  res.json({ success: true, message: 'Logged out successfully' });
});

export const refresh = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) return next(new AppError('Refresh token required', 401));

  const user = await User.findOne({ refreshToken }).select('+refreshToken');
  if (!user) return next(new AppError('Invalid refresh token', 401));

  const { accessToken, refreshToken: newRefreshToken } = generateTokens(user._id);
  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, newRefreshToken);
  res.json({ success: true, message: 'Tokens refreshed' });
});

export const getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id)
    .populate('enrolledCourses.course', 'title slug thumbnail category grade price')
    .select('-password -refreshToken');

  res.json({ success: true, user: { id: user._id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role, grade: user.grade, board: user.board, avatar: user.avatar, phone: user.phone, dateOfBirth: user.dateOfBirth, membership: user.membership, isEmailVerified: user.isEmailVerified, enrolledCourses: user.enrolledCourses, createdAt: user.createdAt } });
});

export const verifyEmail = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const user = await User.findOne({ emailVerificationToken: token, emailVerificationExpires: { $gt: Date.now() } });
  if (!user) return next(new AppError('Invalid or expired verification token', 400));

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.json({ success: true, message: 'Email verified successfully!' });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new AppError('No user found with this email', 404));

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.passwordResetExpires = Date.now() + 60 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${config.clientUrl}/reset-password/${resetToken}`;
  await sendPasswordResetEmail(user, resetUrl);

  res.json({ success: true, message: 'Password reset link sent to your email' });
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } }).select('+password');
  if (!user) return next(new AppError('Invalid or expired reset token', 400));

  user.password = await hashPassword(password);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.refreshToken = undefined;
  await user.save();

  const { accessToken, refreshToken } = generateTokens(user._id);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setTokenCookies(res, accessToken, refreshToken);
  res.json({ success: true, message: 'Password reset successful' });
});

export const updateProfile = catchAsync(async (req, res, next) => {
  const { firstName, lastName, phone, dateOfBirth, grade, board, avatar } = req.body;

  const user = await User.findByIdAndUpdate(req.user.id, { firstName, lastName, phone, dateOfBirth, grade, board, avatar }, { new: true, runValidators: true }).select('-password -refreshToken');
  res.json({ success: true, user });
});

export const changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');
  const isMatch = await comparePasswords(currentPassword, user.password);
  if (!isMatch) return next(new AppError('Current password is incorrect', 400));

  user.password = await hashPassword(newPassword);
  user.refreshToken = undefined;
  await user.save();

  clearTokenCookies(res);
  res.json({ success: true, message: 'Password changed. Please log in again.' });
});