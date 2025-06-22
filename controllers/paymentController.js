const Payment = require('../models/Payments');
const Bill = require('../models/Bill');

// @desc    Create a new payment

// @route   POST /api/payments  
const createPayment = async (req, res) => {
  const { billId, amount, collectBy } = req.body;

  // Validate input
  if (!billId || !amount) {
    return res.status(400).json({ message: 'Bill ID and amount are required' });
  }

  try {
    // Check if the bill exists
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Check if the amount is valid
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than zero' });
    }
    // Check if the bill is already closed or paid
    if (bill.status === 'Closed' || bill.status === 'Paid') {
      return res.status(400).json({ message: 'Cannot add payment to a closed or paid bill' });
    }

    // Check if the payment amount exceeds the remaining amount
    if (amount > bill.remainPayment) {
      return res.status(400).json({ message: 'Payment amount exceeds remaining payment' }); 
    }
    // Create a new payment
    const payment = new Payment({
      bill: billId,
      amount,
      collectBy,
    });

    // Save the payment
    await payment.save();

   // update the bill's remaining payment and status
    bill.remainPayment -= amount;
    if (bill.remainPayment <= 0) {
      bill.status = 'Paid';
      bill.remainPayment = 0; // Ensure it doesn't go negative
    }
    await bill.save();

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Get all payments By Bill ID
// @route   GET /api/payments/:billId
const getPaymentsByBillId = async (req, res) => {
  const { billId } = req.params;

  try {
    // Check if the bill exists
    const bill = await Bill.findById(billId);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }
    // Fetch payments for the bill
    const payments = await Payment.find({ bill: billId })
        .populate('bill', 'billNumber date totalAmount remainPayment status')
        .sort({ paymentDate: -1 });     
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const deletePaymentByPaymentId = async (req, res) => {
  const { paymentId } = req.params;
  try {
    // Check if the payment exists
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    // Check if the bill exists
    const bill = await Bill.findById(payment.bill);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    } 

    // Update the bill's remaining payment and status
    bill.remainPayment += payment.amount;
    if (bill.remainPayment > 0) {
      bill.status = 'Unpaid'; // Set status to Unpaid if there's remaining payment
    } else {
      bill.status = 'Closed'; // Set status to Closed if no remaining payment
    }
    await bill.save();
    // Delete the payment
    await Payment.findByIdAndDelete(paymentId);
    res.status(200).json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
} 

            

// Export the functions to be used in routes

module.exports = {
  createPayment,
  getPaymentsByBillId,
  deletePaymentByPaymentId
}