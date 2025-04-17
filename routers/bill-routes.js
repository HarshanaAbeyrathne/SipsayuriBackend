const express = require('express');
const router = express.Router();
const {
  getBills,
  getBill,
  createBill,
  updateBill,
  deleteBill
} = require('../controllers/bill-controller');

// Routes for /api/bills
router.route('/')
  .get(getBills)
  .post(createBill);

// Routes for /api/bills/:id
router.route('/:id')
  .get(getBill)
  .put(updateBill)
  .delete(deleteBill);

module.exports = router;
