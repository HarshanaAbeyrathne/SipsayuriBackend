const mongoose = require('mongoose');

const paymentSchema = mongoose.Schema({
    bill: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Bill'
    },
    paymentDate: {
        type: Date,
        required: [true, 'Please add a payment date']
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
}, {
    timestamps: true
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;