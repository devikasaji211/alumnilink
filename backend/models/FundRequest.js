const mongoose = require("mongoose");

const FundRequestSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    purpose: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },  // ✅ Status field
    remainingAmount: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("FundRequest", FundRequestSchema);
