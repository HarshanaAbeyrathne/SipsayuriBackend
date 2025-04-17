
const mongoose = require('mongoose');

const bookSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a book name'],
      unique: true,
      trim: true
    },
    defaultPrice: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Book', bookSchema);