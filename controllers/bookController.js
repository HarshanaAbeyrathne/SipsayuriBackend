const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');

// @desc    Get all books
// @route   GET /api/books
// @access  Public
const getBooks = asyncHandler(async (req, res) => {
  const books = await Book.find(req.query.active === 'true' ? { isActive: true } : {});
  res.status(200).json(books);
});

// @desc    Get a single book
// @route   GET /api/books/:id
// @access  Public
const getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  
  res.status(200).json(book);
});

// @desc    Create a book
// @route   POST /api/books
// @access  Public
const createBook = asyncHandler(async (req, res) => {
  const { name, defaultPrice } = req.body;
  
  // Check if book already exists
  const bookExists = await Book.findOne({ name });
  
  if (bookExists) {
    res.status(400);
    throw new Error('Book with this name already exists');
  }
  
  // Create book
  const book = await Book.create({
    name,
    defaultPrice
  });
  
  if (book) {
    res.status(201).json(book);
  } else {
    res.status(400);
    throw new Error('Invalid book data');
  }
});

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Public
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  
  // If trying to update name, check if new name already exists
  if (req.body.name && req.body.name !== book.name) {
    const bookWithName = await Book.findOne({ name: req.body.name });
    if (bookWithName) {
      res.status(400);
      throw new Error('Book with this name already exists');
    }
  }
  
  const updatedBook = await Book.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  
  res.status(200).json(updatedBook);
});

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Public
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  
  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }
  
  // Set isActive to false instead of deleting
  book.isActive = false;
  await book.save();
  
  res.status(200).json({ id: req.params.id, message: 'Book marked as inactive' });
});

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
};