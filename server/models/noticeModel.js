const mongoose = require('mongoose');

// Define the Notice schema
const noticeSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now, // Set default to current date
  },
});

// Create the Notice model
const Notice = mongoose.model('Notices', noticeSchema);

module.exports = Notice;
