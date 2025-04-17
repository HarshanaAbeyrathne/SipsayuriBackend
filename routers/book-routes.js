const express = require('express');
const router = express.Router();
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');

// Routes for /api/books
router.route('/')
  .get(getBooks)
  .post(createBook);

// Routes for /api/books/:id
router.route('/:id')
  .get(getBook)
  .put(updateBook)
  .delete(deleteBook);

module.exports = router;
