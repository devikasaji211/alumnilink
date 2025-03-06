const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema({
  admissionNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true } // Check if email is included
});

const AdminUser = mongoose.model('AdminUser', adminUserSchema);
module.exports = AdminUser;
