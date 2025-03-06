const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  admissionNumber: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: Date, required: true },
  department: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  profilePicture: { type: String },
  idProof: { type: String },
  industry: { type: String },
  yearsOfExperience: { type: Number },
  currentJobTitle: { type: String },
  company: { type: String },
  linkedInProfile: { type: String },
  isVerified: { type: Boolean, default: false },
});

module.exports = mongoose.model('Alumni', alumniSchema);