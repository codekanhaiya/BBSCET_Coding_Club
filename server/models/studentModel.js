const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  course: { type: String, required: true },
  subField: { type: String },
  year: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  gender: { type: String, required: true },
  password: { type: String, required: true },
  date: {
    type: Date,
    required: true,
    default: Date.now, // Set default to current date
  },
});

module.exports = mongoose.model('students', studentSchema);
