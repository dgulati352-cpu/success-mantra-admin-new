import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  videoDuration: {
    type: Number,
    default: 0
  },
  order: {
    type: Number,
    required: true
  },
  isFree: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  resources: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['pdf', 'doc', 'link', 'video', 'other']
    }
  }],
  liveStream: {
    scheduledAt: Date,
    duration: Number,
    streamKey: String,
    playbackUrl: String,
    isLive: {
      type: Boolean,
      default: false
    },
    recordedUrl: String,
    recordedAt: Date,
    isRecordedAvailable: {
      type: Boolean,
      default: false
    },
    vipOnlyRecorded: {
      type: Boolean,
      default: true
    }
  }
}, { _id: true });

const moduleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    required: true
  },
  lessons: [lessonSchema]
}, { _id: true });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 300
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true,
    enum: ['account', 'business', 'economics', 'cuet', 'ca-foundation', 'other']
  },
  grade: {
    type: String,
    required: true,
    enum: ['11', '12', 'cuet', 'ca-foundation']
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  modules: [moduleSchema],
  requirements: [{
    type: String,
    trim: true
  }],
  whatYouWillLearn: [{
    type: String,
    trim: true
  }],
  targetAudience: [{
    type: String,
    trim: true
  }],
  tags: [{
    type: String,
    trim: true
  }],
  language: {
    type: String,
    default: 'English'
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  enrollmentCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  stripeProductId: String,
  stripePriceId: String
}, {
  timestamps: true
});

courseSchema.index({ slug: 1 });
courseSchema.index({ category: 1, grade: 1 });
courseSchema.index({ instructor: 1 });
courseSchema.index({ isPublished: 1, isFeatured: 1 });

export default mongoose.model('Course', courseSchema);