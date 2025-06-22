const mongoose = require('mongoose');

const bookEntrySchema = mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Book'
    },
    bookName: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: 0
    },
    quantity: {
      type: Number,
      required: [true, 'Please add a quantity'],
      min: 0
    },
    freeIssue: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    _id: true
  }
);

const billSchema = mongoose.Schema(
  {
    billNumber: {
      type: String,
      required: [true, 'Please add a bill number'],
      unique: true,
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Please add a date'],
      default: Date.now
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Teacher'
    },
    bookEntries: [bookEntrySchema],
    totalAmount: {
      type: Number,
      required: true,
      default: 0
    },
    remainPayment: {
      type: Number,
      required: true,
      default: function() {
        return this.totalAmount;
      }
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Closed'],
      default: 'Pending'
    } 
  },
  {
    timestamps: true
  }
);

// Pre-save middleware to ensure remainPayment is set correctly for new bills
billSchema.pre('save', function(next) {
  if (this.isNew && this.remainPayment === undefined) {
    this.remainPayment = this.totalAmount;
  }
  next();
});

module.exports = mongoose.model('Bill', billSchema);