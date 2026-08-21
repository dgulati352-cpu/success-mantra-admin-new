import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Course from '../models/Course.js';
import LiveStream from '../models/LiveStream.js';
import { connectDB } from '../config/database.js';

export const seedDatabase = async () => {
  try {
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Database already has data. Skipping seed.');
      return;
    }

    console.log('Seeding database with initial data...');

    const hashedPassword = await bcrypt.hash('Password123!', 12);

    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'SuccessMantra',
      email: 'admin@successmantra.com',
      password: hashedPassword,
      role: 'admin',
      isEmailVerified: true,
      grade: 'other',
      board: 'CBSE',
      membership: { type: 'vip', startDate: new Date() }
    });

    const instructor1 = await User.create({
      firstName: 'Dr. Rajesh',
      lastName: 'Sharma',
      email: 'rajesh.sharma@successmantra.com',
      password: hashedPassword,
      role: 'instructor',
      isEmailVerified: true,
      grade: '12',
      board: 'CBSE',
      membership: { type: 'vip', startDate: new Date() }
    });

    const instructor2 = await User.create({
      firstName: 'CA Sunita',
      lastName: 'Agarwal',
      email: 'sunita.agarwal@successmantra.com',
      password: hashedPassword,
      role: 'instructor',
      isEmailVerified: true,
      grade: 'ca-foundation',
      board: 'CBSE',
      membership: { type: 'vip', startDate: new Date() }
    });

    const sampleCourses = [
      {
        title: 'Class 12 Accountancy Masterclass (CBSE & State Boards)',
        slug: 'class-12-accountancy-masterclass',
        shortDescription: 'Master Partnership, Company Accounts, and Financial Statement Analysis with practical examples and solved board papers.',
        description: 'Comprehensive complete syllabus coverage of Class 12 Accountancy. Includes partnership accounting, goodwill valuation, admission, retirement, death, dissolution, shares, debentures, and cash flow statements.',
        category: 'account',
        grade: '12',
        instructor: instructor1._id,
        price: 2499,
        originalPrice: 4999,
        currency: 'INR',
        language: 'English/Hindi',
        level: 'intermediate',
        isPublished: true,
        isFeatured: true,
        enrollmentCount: 420,
        rating: { average: 4.9, count: 88 },
        whatYouWillLearn: [
          'Full mastery of Partnership and Company Accounts',
          'Step-by-step Cash Flow Statement analysis',
          'Top 100 Board Exam question solving techniques',
          'Shortcuts and working notes strategies'
        ],
        modules: [
          {
            title: 'Module 1: Fundamentals of Partnership',
            description: 'Core rules, Profit & Loss Appropriation, Past Adjustments',
            order: 1,
            lessons: [
              {
                title: '1.1 Introduction & Partnership Deed Essentials',
                description: 'Overview of provisions affecting accounting in absence of partnership deed.',
                videoUrl: 'https://www.w3schools.com/tags/html/video-elements.mp4',
                videoDuration: 1800,
                order: 1,
                isFree: true,
                isPublished: true
              },
              {
                title: '1.2 Profit & Loss Appropriation Account & Capital Accounts',
                description: 'Fixed vs Fluctuating Capital methods explained with comprehensive illustrations.',
                videoUrl: 'https://www.w3schools.com/tags/html/video-elements.mp4',
                videoDuration: 2400,
                order: 2,
                isFree: false,
                isPublished: true
              }
            ]
          },
          {
            title: 'Module 2: Accounting for Companies - Issue of Shares',
            description: 'Issue at par, premium, pro-rata allotment, forfeiture and re-issue',
            order: 2,
            lessons: [
              {
                title: '2.1 Pro-Rata Allotment Calculation Tricks',
                description: 'Never make a mistake in pro-rata table and journal entries again.',
                videoUrl: 'https://www.w3schools.com/tags/html/video-elements.mp4',
                videoDuration: 2700,
                order: 1,
                isFree: false,
                isPublished: true
              }
            ]
          }
        ]
      },
      {
        title: 'Class 12 Economics: Macroeconomics & Indian Economic Development',
        slug: 'class-12-macroeconomics-ied',
        shortDescription: 'In-depth coverage of National Income, Money & Banking, Determination of Income & Employment, and Indian Economy.',
        description: 'Prepare thoroughly for Class 12 Economics board exam with clear conceptual clarity, graphical representations, numerical tricks, and detailed IED timelines.',
        category: 'economics',
        grade: '12',
        instructor: instructor1._id,
        price: 1999,
        originalPrice: 3999,
        currency: 'INR',
        language: 'English/Hindi',
        level: 'intermediate',
        isPublished: true,
        isFeatured: true,
        enrollmentCount: 315,
        rating: { average: 4.8, count: 64 },
        whatYouWillLearn: [
          'National Income Aggregates and Methods of Measurement',
          'AD-AS Model and Multiplier numericals',
          'Complete IED timeline and development strategies',
          'Government Budget & Balance of Payments'
        ],
        modules: [
          {
            title: 'Module 1: National Income and Related Aggregates',
            description: 'Value Added, Income, and Expenditure methods',
            order: 1,
            lessons: [
              {
                title: '1.1 Circular Flow of Income & Key Aggregates',
                description: 'GDP, GNP, NNP at factor cost and market price.',
                videoUrl: 'https://www.w3schools.com/tags/html/video-elements.mp4',
                videoDuration: 2100,
                order: 1,
                isFree: true,
                isPublished: true
              }
            ]
          }
        ]
      },
      {
        title: 'CA Foundation Principles and Practice of Accounting',
        slug: 'ca-foundation-accounting-complete',
        shortDescription: 'Complete ICAI module coverage for CA Foundation Paper 1 with past exam questions and RTP/MTP series.',
        description: 'Structured course for CA Foundation aspirants covering Journal, Ledger, Trial Balance, BRS, Inventory, Depreciation, Special Transactions, Partnership, and NPO.',
        category: 'ca-foundation',
        grade: 'ca-foundation',
        instructor: instructor2._id,
        price: 3499,
        originalPrice: 6999,
        currency: 'INR',
        language: 'English/Hindi',
        level: 'advanced',
        isPublished: true,
        isFeatured: true,
        enrollmentCount: 512,
        rating: { average: 4.95, count: 120 },
        whatYouWillLearn: [
          'Master all 10 modules of CA Foundation Paper 1',
          'High-scoring presentation techniques for ICAI evaluation',
          'Full coverage of RTP, MTP, and past 5 years question papers'
        ],
        modules: [
          {
            title: 'Module 1: Theoretical Framework & Accounting Process',
            description: 'Accounting concepts, capital vs revenue expenditures, BRS',
            order: 1,
            lessons: [
              {
                title: '1.1 Bank Reconciliation Statement & Adjusted Cash Book',
                description: 'Cracking the toughest BRS problems with ease.',
                videoUrl: 'https://www.w3schools.com/tags/html/video-elements.mp4',
                videoDuration: 2500,
                order: 1,
                isFree: true,
                isPublished: true
              }
            ]
          }
        ]
      },
      {
        title: 'CUET General Test & Commerce Domain Crash Course',
        slug: 'cuet-commerce-general-test',
        shortDescription: 'Ace CUET UG entrance with targeted MCQ practice, conceptual revisions, and mock tests for top central universities.',
        description: 'Comprehensive preparation for CUET Commerce domain subjects (Accountancy, Business Studies, Economics) plus General Test (Quantitative Reasoning, Logical Reasoning, GK).',
        category: 'cuet',
        grade: 'cuet',
        instructor: instructor1._id,
        price: 1799,
        originalPrice: 3499,
        currency: 'INR',
        language: 'English/Hindi',
        level: 'beginner',
        isPublished: true,
        isFeatured: false,
        enrollmentCount: 280,
        rating: { average: 4.7, count: 52 },
        whatYouWillLearn: [
          'High-speed MCQ solving techniques for CUET NTA pattern',
          'Commerce domain NCERT syllabus review',
          'Mock tests with full time management strategy'
        ],
        modules: [
          {
            title: 'Module 1: CUET Domain Strategy & High Yield Topics',
            description: 'Chapter-wise weightage and NCERT highlights',
            order: 1,
            lessons: [
              {
                title: '1.1 NTA CUET Exam Pattern and Scoring Blueprint',
                description: 'How to maximize your percentile in Commerce domains.',
                videoUrl: 'https://www.w3schools.com/tags/html/video-elements.mp4',
                videoDuration: 1500,
                order: 1,
                isFree: true,
                isPublished: true
              }
            ]
          }
        ]
      }
    ];

    const createdCourses = await Course.insertMany(sampleCourses);

    await LiveStream.create([
      {
        title: 'Live Doubt Clearing Session - Class 12 Partnership Accounts',
        description: 'Live interactive doubt resolution and past board paper problem solving.',
        course: createdCourses[0]._id,
        instructor: instructor1._id,
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        estimatedDuration: 60,
        status: 'scheduled',
        streamKey: 'stream_part_123',
        isPublic: true,
        requiredMembership: 'free'
      },
      {
        title: 'Masterclass: Fast Track BRS & Depreciation for CA Foundation',
        description: 'Special weekend live class focusing on high weightage ICAI exam topics.',
        course: createdCourses[2]._id,
        instructor: instructor2._id,
        scheduledAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        estimatedDuration: 90,
        status: 'scheduled',
        streamKey: 'stream_ca_456',
        isPublic: true,
        requiredMembership: 'free'
      }
    ]);

    console.log('Database seeded successfully with courses, users, and live streams!');
  } catch (error) {
    console.error('Database seed error:', error);
  }
};

if (process.argv[1] && process.argv[1].endsWith('seedDatabase.js')) {
  connectDB().then(async () => {
    await seedDatabase();
    process.exit(0);
  });
}
