const express = require('express');
const router = express.Router();
const {
  createPayment,
  getPaymentsByBillId,
  deletePaymentByPaymentId
} = require('../controllers/paymentController');

// Create a new payment
// POST /api/payments
router.post('/', createPayment);

// Get all payments for a specific bill
// GET /api/payments/bill/:billId
router.get('/bill/:billId', getPaymentsByBillId);

// Delete a payment by payment ID
// DELETE /api/payments/:paymentId
router.delete('/:paymentId', deletePaymentByPaymentId);

module.exports = router;