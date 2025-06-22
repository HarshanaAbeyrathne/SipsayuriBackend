const mongoose = require('mongoose');
const { collection } = require('./userModel');

const paymentSchema = mongoose.Schema({
    bill: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Bill'
    },
    paymentDate: {
        type: Date,
        required: [true, 'Please add a payment date'],
        default: Date.now
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
        min: 0
    },
    collectBy: {
        type: String,
        required: false, 
    },
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
