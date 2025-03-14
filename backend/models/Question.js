const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  studentName: { type: String, required: true }, // Store student name
  question: { type: String, required: true },
  answer: { type: String, default: "" },
  alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  alumniName: { type: String }, // Store alumni name
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Question", QuestionSchema);


