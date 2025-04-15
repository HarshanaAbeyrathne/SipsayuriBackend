const mongoose = require('mongoose');

const teacherSchema = mongoose.Schema(
  {
    teacherName: {
      type: String,
      required: [true, 'Please add a teacher name'],
      trim: true
    },
    mobile: {
      type: String,
      required: [true, 'Please add a mobile number'],
      trim: true,
      validate: {
        validator: function(v) {
          // Basic validation for mobile number
          return /^\d{10,15}$/.test(v);
        },
        message: props => `${props.value} is not a valid mobile number!`
      }
    },
    schoolName: {
      type: String,
      required: [true, 'Please add a school name'],
      trim: true
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Teacher', teacherSchema);