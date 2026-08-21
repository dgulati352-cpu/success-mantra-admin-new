import express from 'express';

const router = express.Router();

const lectures = [
  {
    id: 'lec-acc-12-01',
    title: 'Partnership Fundamentals: Profit & Loss Appropriation & Capital Accounts',
    subject: 'Accountancy',
    grade: '12',
    category: '12',
    exam: 'CBSE Class 12 Boards',
    chapter: 'Chapter 1: Partnership Fundamentals',
    lectureNo: '01',
    duration: '52 mins',
    instructor: 'Prof. S. K. Sharma',
    instructorTitle: 'Senior Faculty & Author',
    views: '28.4K',
    rating: 4.95,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    accentColor: 'from-blue-600 to-indigo-700',
    description: 'Complete breakdown of P&L Appropriation Account, Partner Capital Accounts (Fixed vs Fluctuating), Interest on Drawings calculation rules with shortcuts.',
    timestamps: [
      { time: '00:00', title: 'Introduction to Partnership Deed Rules' },
      { time: '12:30', title: 'P&L Appropriation Account Format' },
      { time: '25:15', title: 'Interest on Capital & Drawings Product Method' },
      { time: '39:40', title: 'Past Adjustments & Guarantee of Profits' },
      { time: '48:10', title: 'Board Question Solving (6 Marks Problem)' }
    ],
    pdfNotesPages: 18,
    pdfNotesAvailable: true,
  },
  {
    id: 'lec-acc-12-02',
    title: 'Admission of a Partner: Revaluation Account & Goodwill Treatment (AS-26)',
    subject: 'Accountancy',
    grade: '12',
    category: '12',
    exam: 'CBSE Class 12 Boards',
    chapter: 'Chapter 3: Admission of Partner',
    lectureNo: '02',
    duration: '64 mins',
    instructor: 'Prof. S. K. Sharma',
    instructorTitle: 'Senior Faculty & Author',
    views: '22.1K',
    rating: 4.9,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    accentColor: 'from-blue-600 to-indigo-700',
    description: 'Master Revaluation of Assets & Liabilities, Sacrificing Ratio tricks, Premium for Goodwill journal entries, and Balance Sheet reconstitution.',
    timestamps: [
      { time: '00:00', title: 'Sacrificing Ratio 5 Shortcut Cases' },
      { time: '15:20', title: 'Goodwill Accounting under AS-26' },
      { time: '32:45', title: 'Comprehensive Revaluation Account' },
      { time: '52:10', title: 'Capital Adjustment Case 1 & 2' }
    ],
    pdfNotesPages: 24,
    pdfNotesAvailable: true,
  },
  {
    id: 'lec-bst-12-01',
    title: 'Principles of Management: Fayol’s 14 Principles vs Taylor’s Scientific Management',
    subject: 'Business Studies',
    grade: '12',
    category: '12',
    exam: 'CBSE Class 12 Boards',
    chapter: 'Chapter 2: Principles of Management',
    lectureNo: '01',
    duration: '45 mins',
    instructor: 'Dr. Neha Verma',
    instructorTitle: 'CBSE Board Examiner',
    views: '35.6K',
    rating: 4.92,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    accentColor: 'from-purple-600 to-pink-600',
    description: 'Decode Fayol’s 14 principles with real corporate case studies from Apple, Tata, and Amazon. Visual flowcharts for instant memory retention.',
    timestamps: [
      { time: '00:00', title: 'Nature & Significance of Principles' },
      { time: '10:15', title: 'Fayol’s 14 Administrative Principles' },
      { time: '28:30', title: 'Taylor’s Scientific Techniques (Motion, Fatigue, Time Study)' },
      { time: '38:00', title: 'Fayol vs Taylor Direct Comparison Matrix' }
    ],
    pdfNotesPages: 15,
    pdfNotesAvailable: true,
  },
  {
    id: 'lec-bst-12-02',
    title: 'Marketing Management: 4 Ps Framework & Consumer Protection Act 2019',
    subject: 'Business Studies',
    grade: '12',
    category: '12',
    exam: 'CBSE Class 12 Boards',
    chapter: 'Chapter 11: Marketing Management',
    lectureNo: '02',
    duration: '58 mins',
    instructor: 'Dr. Neha Verma',
    instructorTitle: 'CBSE Board Examiner',
    views: '19.8K',
    rating: 4.88,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    accentColor: 'from-purple-600 to-pink-600',
    description: 'Product, Price, Place, Promotion masterclass with labeling regulations, 3-tier redressal machinery under Consumer Protection Act 2019.',
    timestamps: [
      { time: '00:00', title: 'Marketing Philosophies (Production to Societal)' },
      { time: '16:45', title: 'Product Mix: Branding, Packaging & Labeling' },
      { time: '34:10', title: 'Pricing Factors & Channels of Distribution' },
      { time: '46:30', title: 'Consumer Rights & Three-Tier Redressal Commission' }
    ],
    pdfNotesPages: 22,
    pdfNotesAvailable: true,
  },
  {
    id: 'lec-eco-12-01',
    title: 'National Income Accounting: Value Added, Income & Expenditure Methods',
    subject: 'Macroeconomics',
    grade: '12',
    category: '12',
    exam: 'CBSE Class 12 Boards',
    chapter: 'Chapter 2: National Income & Aggregates',
    lectureNo: '01',
    duration: '62 mins',
    instructor: 'Prof. R. C. Gupta',
    instructorTitle: 'Economics Department Head',
    views: '41.2K',
    rating: 4.96,
    isFree: false,
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    accentColor: 'from-teal-600 to-emerald-700',
    description: 'Master GDPmp, NNPfc, NFIA, NIT conversion tricks. Comprehensive numerical solving for Value Added, Income, and Expenditure methods.',
    timestamps: [
      { time: '00:00', title: 'Circular Flow of Income & 8 Aggregates' },
      { time: '14:20', title: 'Value Added Method (Gross Value of Output - IC)' },
      { time: '30:15', title: 'Income Method (COE + OS + Mixed Income)' },
      { time: '45:00', title: 'Expenditure Method & Real vs Nominal GDP' },
      { time: '55:30', title: 'Tricky Board Numerical Problem Solved' }
    ],
    pdfNotesPages: 28,
    pdfNotesAvailable: true,
  },
  {
    id: 'lec-acc-11-01',
    title: 'Financial Accounting Fundamentals: Journal Entries & Golden Rules of Accounting',
    subject: 'Accountancy',
    grade: '11',
    category: '11',
    exam: 'CBSE Class 11 Exams',
    chapter: 'Chapter 3: Recording of Transactions',
    lectureNo: '01',
    duration: '50 mins',
    instructor: 'Prof. S. K. Sharma',
    instructorTitle: 'Senior Faculty & Author',
    views: '16.5K',
    rating: 4.91,
    isFree: true,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    accentColor: 'from-blue-600 to-indigo-700',
    description: 'Debit & Credit rules for Real, Personal, and Nominal accounts with 25 standard journal entry illustrations and compound entries.',
    timestamps: [
      { time: '00:00', title: 'Classification of Accounts (Traditional vs Modern)' },
      { time: '12:00', title: 'Rules of Debit & Credit' },
      { time: '24:30', title: 'Trade Discount vs Cash Discount Entries' },
      { time: '40:00', title: 'GST Accounting in Journal Entries' }
    ],
    pdfNotesPages: 16,
    pdfNotesAvailable: true,
  }
];

// GET /api/lectures - List all lectures with filters
router.get('/', (req, res) => {
  const { grade, category, subject, search, freeOnly } = req.query;
  let result = [...lectures];

  if (grade && grade !== 'all') {
    result = result.filter((l) => l.grade === grade);
  }
  if (category && category !== 'all') {
    result = result.filter((l) => l.category === category);
  }
  if (subject && subject !== 'all') {
    result = result.filter((l) => l.subject === subject);
  }
  if (freeOnly === 'true') {
    result = result.filter((l) => l.isFree);
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.chapter.toLowerCase().includes(q) ||
        l.instructor.toLowerCase().includes(q) ||
        l.subject.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: result.length,
    data: result,
  });
});

// GET /api/lectures/:id - Get specific lecture details
router.get('/:id', (req, res) => {
  const lecture = lectures.find((l) => l.id === req.params.id);
  if (!lecture) {
    return res.status(404).json({ success: false, message: 'Lecture not found' });
  }

  res.json({
    success: true,
    data: lecture,
  });
});

// POST /api/lectures/:id/doubt - Submit question from student
router.post('/:id/doubt', (req, res) => {
  const { question, timestamp, studentEmail } = req.body;
  const lecture = lectures.find((l) => l.id === req.params.id);

  if (!question) {
    return res.status(400).json({ success: false, message: 'Please provide your doubt question' });
  }

  res.status(201).json({
    success: true,
    message: `Your doubt has been submitted to ${lecture ? lecture.instructor : 'Faculty'}. Response will arrive via email within 2 hours.`,
    data: {
      doubtId: `SM-DBT-${Date.now().toString(36).toUpperCase()}`,
      lectureId: req.params.id,
      question,
      timestamp: timestamp || '00:00',
      status: 'pending_faculty_review',
      createdAt: new Date().toISOString(),
    },
  });
});

export default router;
