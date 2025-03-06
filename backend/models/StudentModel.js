const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  admissionNumber: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  department: { type: String, required: true },
  yearOfAdmission: { type: Number, required: true },
  currentYear: { type: String, required: true }, // Ensure this field is sent from frontend
  rollNumber: { type: String, required: true },
  ktuId: { type: String, required: true },  // ✅ Added KTU ID
  graduationYear: { type: Number, required: true },  // ✅ Added Graduation Year
  idCard: { type: String },
  profilePicture: { type: String },
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('Student', studentSchema);
