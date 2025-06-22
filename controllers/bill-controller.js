const asyncHandler = require('express-async-handler');
const Bill = require('../models/Bill');
const Teacher = require('../models/Teacher');
const Book = require('../models/Book');

// @desc    Get all bills
// @route   GET /api/bills
// @access  Public
const getBills = asyncHandler(async (req, res) => {
  const bills = await Bill.find({})
    .populate('teacher', 'teacherName mobile schoolName') // Ensure all relevant fields are populated
    .sort({ createdAt: -1 });
  
  console.log('Fetched Bills:', bills);
  res.status(200).json(bills);
});


// @desc    Get a single bill
// @route   GET /api/bills/:id
// @access  Public
const getBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id)
    .populate('teacher', 'name mobile school');
  
  if (!bill) {
    res.status(404);
    throw new Error('Bill not found');
  }
  
  res.status(200).json(bill);
});

// @desc    Create a bill
// @route   POST /api/bills
// @access  Public
const createBill = asyncHandler(async (req, res) => {
  const { billNumber, date, teacherId, bookEntries } = req.body;
  
  // Check if bill with this number already exists
  const billExists = await Bill.findOne({ billNumber });
  if (billExists) {
    res.status(400);
    throw new Error('Bill with this number already exists');
  }
  
  // Check if teacher exists
  const teacher = await Teacher.findById(teacherId);
  if (!teacher) {
    res.status(404);
    throw new Error('Teacher not found');
  }
  
  // Process book entries
  if (!bookEntries || bookEntries.length === 0) {
    res.status(400);
    throw new Error('At least one book entry is required');
  }
  
  // Validate and process each book entry
  const processedBookEntries = [];
  let totalAmount = 0;
  
  for (const entry of bookEntries) {
    const { bookId, price, quantity, freeIssue } = entry;
    
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      res.status(404);
      throw new Error(`Book with ID ${bookId} not found`);
    }
    
    // Calculate total for this entry
    const entryTotal = price * quantity;
    totalAmount += entryTotal;
    
    processedBookEntries.push({
      book: bookId,
      bookName: book.name,
      price,
      quantity,
      freeIssue: freeIssue || 0,
      total: entryTotal
    });
  }
  
  // Create bill
  const bill = await Bill.create({
    billNumber,
    date: date || new Date(),
    teacher: teacherId,
    bookEntries: processedBookEntries,
    totalAmount
  });
  
  if (bill) {
    res.status(201).json(bill);
  } else {
    res.status(400);
    throw new Error('Invalid bill data');
  }
});

// @desc    Update a bill
// @route   PUT /api/bills/:id
// @access  Public
const updateBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  
  if (!bill) {
    res.status(404);
    throw new Error('Bill not found');
  }
  
  const { billNumber, date, teacherId, bookEntries } = req.body;
  
  // Check if new bill number already exists (if changing)
  if (billNumber && billNumber !== bill.billNumber) {
    const billWithNumber = await Bill.findOne({ billNumber });
    if (billWithNumber) {
      res.status(400);
      throw new Error('Bill with this number already exists');
    }
  }
  
  // Check if teacher exists (if changing)
  if (teacherId && teacherId !== bill.teacher.toString()) {
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      res.status(404);
      throw new Error('Teacher not found');
    }
  }
  
  let updatedBill;
  
  // If updating book entries, recalculate totals
  if (bookEntries && bookEntries.length > 0) {
    const processedBookEntries = [];
    let totalAmount = 0;
    
    for (const entry of bookEntries) {
      const { bookId, price, quantity, freeIssue } = entry;
      
      // Check if book exists
      const book = await Book.findById(bookId);
      if (!book) {
        res.status(404);
        throw new Error(`Book with ID ${bookId} not found`);
      }
      
      // Calculate total for this entry
      const entryTotal = price * quantity;
      totalAmount += entryTotal;
      
      processedBookEntries.push({
        book: bookId,
        bookName: book.name,
        price,
        quantity,
        freeIssue: freeIssue || 0,
        total: entryTotal
      });
    }
    
    // Update bill with new entries and total
    updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      {
        billNumber: billNumber || bill.billNumber,
        date: date || bill.date,
        teacher: teacherId || bill.teacher,
        bookEntries: processedBookEntries,
        totalAmount
      },
      { new: true, runValidators: true }
    );
  } else {
    // Update bill without changing book entries
    updatedBill = await Bill.findByIdAndUpdate(
      req.params.id,
      {
        billNumber: billNumber || bill.billNumber,
        date: date || bill.date,
        teacher: teacherId || bill.teacher
      },
      { new: true, runValidators: true }
    );
  }
  
  res.status(200).json(updatedBill);
});

// @desc    Delete a bill
// @route   DELETE /api/bills/:id
// @access  Public
const deleteBill = asyncHandler(async (req, res) => {
  const bill = await Bill.findById(req.params.id);
  
  if (!bill) {
    res.status(404);
    throw new Error('Bill not found');
  }
  
  await bill.deleteOne();
  
  res.status(200).json({ id: req.params.id, message: 'Bill removed' });
});

module.exports = {
  getBills,
  getBill,
  createBill,
  updateBill,
  deleteBill
};
