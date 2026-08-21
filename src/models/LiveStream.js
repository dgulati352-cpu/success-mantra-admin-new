import mongoose from 'mongoose';

const liveStreamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  lesson: {
    type: mongoose.Schema.Types.ObjectId
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  estimatedDuration: {
    type: Number,
    default: 60
  },
  actualDuration: Number,
  status: {
    type: String,
    enum: ['scheduled', 'live', 'ended', 'cancelled', 'recording'],
    default: 'scheduled'
  },
  streamKey: {
    type: String,
    unique: true
  },
  playbackUrl: String,
  hlsUrl: String,
  rtmpUrl: String,
  isRecorded: {
    type: Boolean,
    default: false
  },
  recordedUrl: String,
  recordedAt: Date,
  recordingStatus: {
    type: String,
    enum: ['not_started', 'processing', 'completed', 'failed'],
    default: 'not_started'
  },
  vipOnlyRecorded: {
    type: Boolean,
    default: true
  },
  maxViewers: {
    type: Number,
    default: 0
  },
  currentViewers: {
    type: Number,
    default: 0
  },
  totalViews: {
    type: Number,
    default: 0
  },
  chatEnabled: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  requiredMembership: {
    type: String,
    enum: ['free', 'basic', 'premium', 'vip'],
    default: 'free'
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

liveStreamSchema.index({ instructor: 1, scheduledAt: -1 });
liveStreamSchema.index({ course: 1 });
liveStreamSchema.index({ status: 1, scheduledAt: 1 });
liveStreamSchema.index({ streamKey: 1 });

export default mongoose.model('LiveStream', liveStreamSchema);