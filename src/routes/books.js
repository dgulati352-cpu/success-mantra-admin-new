import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Mock Initial Bookstore Catalog
const catalog = [
  {
    id: 'book-acc-12-01',
    title: 'Class 12 Accountancy: Master Question Bank & Guide 2026',
    author: 'Prof. S. K. Sharma',
    subject: 'Accountancy',
    grade: '12',
    category: '12',
    format: 'Paperback + eBook',
    price: 499,
    originalPrice: 899,
    discount: '44% OFF',
    rating: 4.9,
    reviewsCount: 320,
    salesCount: 1450,
    coverImage: '/images/books/book-acc-12.jpg',
    pages: 420,
    isbn: '978-81-94567-01-2',
    description: 'Comprehensive CBSE Class 12 board study guide covering Partnership, Company Accounts, Cash Flow Statements with 10-year solved scanner and 5 sample papers.',
    previewPages: 5,
    totalPages: 420,
    inStock: true,
  },
  {
    id: 'book-bst-12-01',
    title: 'Business Studies Class 12: Toppers Handwritten Formula & Case Studies Notes',
    author: 'Dr. Neha Verma & Board Rankers',
    subject: 'Business Studies',
    grade: '12',
    category: '12',
    format: 'Handwritten Notes (Hardcover)',
    price: 399,
    originalPrice: 699,
    discount: '43% OFF',
    rating: 4.85,
    reviewsCount: 215,
    salesCount: 1120,
    coverImage: '/images/books/book-bst-12.jpg',
    pages: 280,
    isbn: '978-81-94567-02-9',
    description: 'Handcrafted topper notes with visual mind-maps, Fayol principles diagrams, marketing case study framework, and high-scoring answer presentation tips.',
    previewPages: 5,
    totalPages: 280,
    inStock: true,
  },
  {
    id: 'book-eco-12-01',
    title: 'Class 12 Macroeconomics & Indian Economic Development Guide',
    author: 'Prof. R. C. Gupta',
    subject: 'Economics',
    grade: '12',
    category: '12',
    format: 'Paperback + Digital Formula Sheet',
    price: 449,
    originalPrice: 799,
    discount: '44% OFF',
    rating: 4.92,
    reviewsCount: 280,
    salesCount: 1340,
    coverImage: '/images/books/book-eco-12.jpg',
    pages: 360,
    isbn: '978-81-94567-06-7',
    description: 'Complete National Income numericals, Money & Banking concepts, Balance of Payments breakdown, and chronological timeline charts for Indian Economic Development.',
    previewPages: 5,
    totalPages: 360,
    inStock: true,
  },
  {
    id: 'book-acc-11-01',
    title: 'Class 11 Financial Accounting Fundamentals & Practical Numerical Guide',
    author: 'Prof. S. K. Sharma',
    subject: 'Accountancy',
    grade: '11',
    category: '11',
    format: 'Paperback',
    price: 379,
    originalPrice: 649,
    discount: '42% OFF',
    rating: 4.88,
    reviewsCount: 190,
    salesCount: 890,
    coverImage: '/images/books/book-acc-12.jpg',
    pages: 310,
    isbn: '978-81-94567-07-4',
    description: 'Journal Entries mastery, Trial Balance, Depreciation (SLM vs WDV), Bank Reconciliation Statement (BRS), and Final Accounts with adjustments.',
    previewPages: 5,
    totalPages: 310,
    inStock: true,
  },
];

// GET /api/books - List catalog with filters and search
router.get('/', (req, res) => {
  const { category, search, grade } = req.query;
  let books = [...catalog];

  if (category && category !== 'all') {
    books = books.filter((b) => b.category === category || b.grade === category);
  }
  if (grade && grade !== 'all') {
    books = books.filter((b) => b.grade === grade);
  }
  if (search) {
    const q = search.toLowerCase();
    books = books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.subject.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    count: books.length,
    data: books,
  });
});

// GET /api/books/:id - Get book details & 5-page sample metadata
router.get('/:id', (req, res) => {
  const book = catalog.find((b) => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ success: false, message: 'Book not found' });
  }

  res.json({
    success: true,
    data: {
      ...book,
      sampleViewer: {
        freePages: 5,
        lockedPagesStart: 6,
        isPaywallRequired: true,
      },
    },
  });
});

// POST /api/books/sell - Seller portal listing submission
router.post('/sell', (req, res) => {
  const { title, author, grade, subject, format, sellingPrice, pages, description, sellerEmail, sellerPhone, bankAccount } = req.body;

  if (!title || !sellingPrice || !sellerEmail) {
    return res.status(400).json({ success: false, message: 'Please provide book title, price, and contact information' });
  }

  const priceNum = Number(sellingPrice) || 300;
  const royaltyEarned = Math.round(priceNum * 0.85);

  const submission = {
    submissionId: `SM-SELL-${Date.now().toString(36).toUpperCase()}`,
    title,
    author: author || 'Community Contributor',
    grade: grade || '12',
    subject: subject || 'Commerce',
    format: format || 'Notes',
    sellingPrice: priceNum,
    royaltyPercentage: 85,
    royaltyAmountPerCopy: royaltyEarned,
    pages: pages || 50,
    description: description || '',
    seller: {
      email: sellerEmail,
      phone: sellerPhone || '',
      bankAccount: bankAccount || '',
    },
    status: 'under_review',
    submittedAt: new Date().toISOString(),
    message: 'Your publication proposal has been submitted to Success Mantra Academic Review Panel. Review takes 24-48 hours.',
  };

  res.status(201).json({
    success: true,
    message: 'Book / Notes submitted for academic review successfully!',
    data: submission,
  });
});

// POST /api/books/order - Direct book order
router.post('/order', (req, res) => {
  const { bookId, shippingAddress, paymentMethod } = req.body;
  const book = catalog.find((b) => b.id === bookId) || catalog[0];

  const order = {
    orderId: `SM-BK-${Date.now().toString().slice(-6)}`,
    book: {
      id: book.id,
      title: book.title,
      price: book.price,
    },
    shippingAddress: shippingAddress || 'Standard Delivery Address',
    paymentMethod: paymentMethod || 'Online (UPI / Card)',
    status: 'confirmed',
    estimatedDelivery: '3-4 Business Days',
    totalAmount: book.price,
    createdAt: new Date().toISOString(),
  };

  res.status(201).json({
    success: true,
    message: 'Book order placed successfully!',
    data: order,
  });
});

export default router;
