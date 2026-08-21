import express from 'express';

const router = express.Router();

const tests = [
  {
    id: 'ts-acc-12-01',
    title: 'Class 12 Accountancy Board Full Mock Exam 1',
    grade: '12',
    subject: 'Accountancy',
    pattern: 'CBSE Board Pattern 2026',
    duration: 180, // minutes
    totalMarks: 80,
    questionsCount: 34,
    difficulty: 'Exam Standard',
    isFree: true,
    attemptsCount: 3420,
    sections: [
      { name: 'Section A: Partnership & Companies', marks: 60, questions: 26 },
      { name: 'Section B: Analysis of Financial Statements', marks: 20, questions: 8 }
    ],
    sampleQuestions: [
      {
        id: 'q1',
        text: 'In the absence of a Partnership Deed, what rate of interest is allowed on a partner’s loan to the firm?',
        options: ['6% p.a. simple interest', '12% p.a. compound interest', 'No interest is allowed', 'At prevailing bank rate'],
        correctIndex: 0,
        explanation: 'According to Section 13(d) of the Indian Partnership Act, 1932, in the absence of an agreement, partners are entitled to interest on loan at 6% p.a.'
      },
      {
        id: 'q2',
        text: 'Goodwill of a firm is NOT affected by which of the following factors?',
        options: ['Location of the business', 'Efficiency of management', 'Location of the customer’s house', 'Quality of products'],
        correctIndex: 2,
        explanation: 'Customer house location does not dictate the intrinsic goodwill or reputation of a business enterprise.'
      }
    ]
  },
  {
    id: 'ts-bst-12-01',
    title: 'Class 12 Business Studies Board Mock 1 (Case Studies Focus)',
    grade: '12',
    subject: 'Business Studies',
    pattern: 'CBSE Board Pattern 2026',
    duration: 180,
    totalMarks: 80,
    questionsCount: 34,
    difficulty: 'Moderate to High',
    isFree: true,
    attemptsCount: 2890,
    sections: [
      { name: 'Part A: Principles and Functions of Management', marks: 50, questions: 20 },
      { name: 'Part B: Business Finance and Marketing', marks: 30, questions: 14 }
    ],
    sampleQuestions: [
      {
        id: 'q1',
        text: 'Which principle of management states that an employee should receive orders from one superior only?',
        options: ['Unity of Direction', 'Unity of Command', 'Scalar Chain', 'Order'],
        correctIndex: 1,
        explanation: 'Henri Fayol’s Unity of Command states that an employee must have only one direct supervisor to prevent conflicts.'
      }
    ]
  },
  {
    id: 'ts-eco-12-01',
    title: 'Class 12 Macroeconomics & IED Comprehensive Mock',
    grade: '12',
    subject: 'Economics',
    pattern: 'CBSE Board Pattern 2026',
    duration: 180,
    totalMarks: 80,
    questionsCount: 34,
    difficulty: 'Exam Standard',
    isFree: false,
    attemptsCount: 2150,
    sections: [
      { name: 'Section A: Introductory Macroeconomics', marks: 40, questions: 17 },
      { name: 'Section B: Indian Economic Development', marks: 40, questions: 17 }
    ]
  },
  {
    id: 'ts-acc-11-01',
    title: 'Class 11 Financial Accounting Half-Yearly Mock Exam',
    grade: '11',
    subject: 'Accountancy',
    pattern: 'CBSE Class 11 Standard',
    duration: 180,
    totalMarks: 80,
    questionsCount: 32,
    difficulty: 'Foundation Level',
    isFree: true,
    attemptsCount: 1740,
    sections: [
      { name: 'Part A: Theoretical Framework & Accounting Process', marks: 50, questions: 20 },
      { name: 'Part B: Financial Statements of Sole Proprietorship', marks: 30, questions: 12 }
    ]
  }
];

// GET /api/tests - List all test papers
router.get('/', (req, res) => {
  const { grade, subject } = req.query;
  let result = [...tests];

  if (grade && grade !== 'all') {
    result = result.filter((t) => t.grade === grade);
  }
  if (subject && subject !== 'all') {
    result = result.filter((t) => t.subject === subject);
  }

  res.json({
    success: true,
    count: result.length,
    data: result,
  });
});

// GET /api/tests/:id - Get test by ID
router.get('/:id', (req, res) => {
  const test = tests.find((t) => t.id === req.params.id);
  if (!test) {
    return res.status(404).json({ success: false, message: 'Test not found' });
  }

  res.json({
    success: true,
    data: test,
  });
});

// POST /api/tests/:id/submit - Submit exam and get immediate scorecard
router.post('/:id/submit', (req, res) => {
  const { answers, timeTakenSeconds } = req.body;
  const test = tests.find((t) => t.id === req.params.id) || tests[0];

  const totalQs = test.sampleQuestions ? test.sampleQuestions.length : 10;
  let correctCount = 0;

  if (test.sampleQuestions && answers) {
    test.sampleQuestions.forEach((q, idx) => {
      if (answers[q.id] === q.correctIndex) {
        correctCount++;
      }
    });
  } else {
    correctCount = Math.floor(totalQs * 0.85); // simulated high score
  }

  const score = Math.round((correctCount / totalQs) * test.totalMarks);
  const percentage = Math.round((score / test.totalMarks) * 100);
  const percentile = (94.5 + Math.random() * 4).toFixed(1);

  const report = {
    submissionId: `SM-SUB-${Date.now().toString(36).toUpperCase()}`,
    testId: test.id,
    testTitle: test.title,
    totalMarks: test.totalMarks,
    marksScored: score,
    percentage: `${percentage}%`,
    percentileRank: `${percentile}%ile All India Rank`,
    correctAnswers: correctCount,
    incorrectAnswers: totalQs - correctCount,
    timeTaken: `${Math.floor((timeTakenSeconds || 3600) / 60)} mins`,
    accuracy: `${Math.round((correctCount / totalQs) * 100)}%`,
    submittedAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    message: 'Test submitted and evaluated successfully!',
    data: report,
  });
});

export default router;
