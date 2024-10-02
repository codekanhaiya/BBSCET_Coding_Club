const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  adminId: { type: String, required: true, unique: true },
  date: {
    type: Date,
    required: true,
    default: Date.now, // Set default to current date
  },
});

const Admin = mongoose.model('admins', adminSchema);

module.exports = Admin;
