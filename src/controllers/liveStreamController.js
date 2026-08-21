import LiveStream from '../models/LiveStream.js';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';
import { config } from '../config/index.js';
import crypto from 'crypto';

export const getLiveStreams = catchAsync(async (req, res, next) => {
  const { status, courseId, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.status = status;
  if (courseId) query.course = courseId;
  const streams = await LiveStream.find(query).populate('instructor', 'firstName lastName avatar').populate('course', 'title slug').sort({ scheduledAt: 1 }).skip((page - 1) * limit).limit(parseInt(limit));
  const total = await LiveStream.countDocuments(query);
  res.json({ success: true, streams, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
});

export const getUpcomingStreams = catchAsync(async (req, res, next) => {
  const streams = await LiveStream.find({ status: 'scheduled', scheduledAt: { $gte: new Date() } }).populate('instructor', 'firstName lastName avatar').populate('course', 'title slug').sort({ scheduledAt: 1 }).limit(10);
  res.json({ success: true, streams });
});

export const getLiveStream = catchAsync(async (req, res, next) => {
  const stream = await LiveStream.findById(req.params.id).populate('instructor', 'firstName lastName avatar email').populate('course', 'title slug');
  if (!stream) return next(new AppError('Live stream not found', 404));
  let canView = stream.isPublic || (req.user && stream.requiredMembership === 'free');
  let canViewRecorded = false;
  if (req.user) {
    const user = await User.findById(req.user.id);
    if (stream.requiredMembership === 'free') canView = true;
    else if (user.membership.type === 'vip' || user.membership.type === 'premium') canView = true;
    else if (user.membership.type === 'basic' && stream.requiredMembership === 'basic') canView = true;
    if (stream.isRecorded && stream.vipOnlyRecorded) canViewRecorded = user.membership.type === 'vip';
    else if (stream.isRecorded) canViewRecorded = true;
  }
  res.json({ success: true, stream, canView, canViewRecorded });
});

export const createLiveStream = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'instructor' && req.user.role !== 'admin') return next(new AppError('Only instructors can create streams', 403));
  const streamKey = crypto.randomBytes(16).toString('hex');
  const stream = await LiveStream.create({ ...req.body, instructor: req.user.id, streamKey });
  res.status(201).json({ success: true, message: 'Live stream scheduled', stream });
});
export const updateLiveStream = catchAsync(async (req, res, next) => {
  const stream = await LiveStream.findById(req.params.id);
  if (!stream) return next(new AppError('Stream not found', 404));
  if (stream.instructor.toString() !== req.user.id && req.user.role !== 'admin') return next(new AppError('Not authorized', 403));
  Object.assign(stream, req.body); await stream.save();
  res.json({ success: true, message: 'Stream updated', stream });
});

export const deleteLiveStream = catchAsync(async (req, res, next) => {
  const stream = await LiveStream.findById(req.params.id);
  if (!stream) return next(new AppError('Stream not found', 404));
  if (stream.instructor.toString() !== req.user.id && req.user.role !== 'admin') return next(new AppError('Not authorized', 403));
  await stream.deleteOne(); res.json({ success: true, message: 'Stream deleted' });
});

export const startLiveStream = catchAsync(async (req, res, next) => {
  const stream = await LiveStream.findById(req.params.id);
  if (!stream) return next(new AppError('Stream not found', 404));
  if (stream.instructor.toString() !== req.user.id && req.user.role !== 'admin') return next(new AppError('Not authorized', 403));
  stream.status = 'live'; await stream.save();
  req.io?.to(`stream:${stream._id}`).emit('stream:started', { streamId: stream._id });
  res.json({ success: true, message: 'Stream started', stream });
});

export const endLiveStream = catchAsync(async (req, res, next) => {
  const stream = await LiveStream.findById(req.params.id);
  if (!stream) return next(new AppError('Stream not found', 404));
  if (stream.instructor.toString() !== req.user.id && req.user.role !== 'admin') return next(new AppError('Not authorized', 403));
  stream.status = 'ended'; stream.actualDuration = Math.round((Date.now() - stream.scheduledAt.getTime()) / 60000); await stream.save();
  req.io?.to(`stream:${stream._id}`).emit('stream:ended', { streamId: stream._id });
  res.json({ success: true, message: 'Stream ended', stream });
});

export const joinLiveStream = catchAsync(async (req, res, next) => {
  const stream = await LiveStream.findById(req.params.id);
  if (!stream) return next(new AppError('Stream not found', 404));
  if (stream.status !== 'live') return next(new AppError('Stream is not live', 400));
  let canJoin = stream.isPublic || (req.user && stream.requiredMembership === 'free');
  if (req.user) {
    const user = await User.findById(req.user.id);
    if (stream.requiredMembership === 'free') canJoin = true;
    else if (user.membership.type === 'vip' || user.membership.type === 'premium') canJoin = true;
    else if (user.membership.type === 'basic' && stream.requiredMembership === 'basic') canJoin = true;
  }
  if (!canJoin) return next(new AppError('Membership required', 403));
  stream.currentViewers += 1; await stream.save();
  res.json({ success: true, stream, rtmpUrl: stream.rtmpUrl, hlsUrl: stream.hlsUrl, playbackUrl: stream.playbackUrl });
});

export const leaveLiveStream = catchAsync(async (req, res, next) => {
  const stream = await LiveStream.findById(req.params.id);
  if (!stream) return next(new AppError('Stream not found', 404));
  stream.currentViewers = Math.max(0, stream.currentViewers - 1); await stream.save();
  res.json({ success: true });
});

export const getRecordedStreams = catchAsync(async (req, res, next) => {
  const { courseId, page = 1, limit = 20 } = req.query;
  const query = { isRecorded: true, recordedUrl: { $exists: true, $ne: '' } };
  if (courseId) query.course = courseId;
  const streams = await LiveStream.find(query).populate('instructor', 'firstName lastName avatar').populate('course', 'title slug').sort({ recordedAt: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
  const total = await LiveStream.countDocuments(query);
  res.json({ success: true, streams, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) } });
});