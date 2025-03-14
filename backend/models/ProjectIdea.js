const mongoose = require("mongoose");

const ProjectIdeaSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: "ProjectTopic", required: true },
  description: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Pending Review", "Accepted", "Rejected", "Under Discussion"], 
    default: "Pending Review" 
  },
  feedback: { type: String, default: "" }, // Alumni can provide feedback if rejected
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ProjectIdea", ProjectIdeaSchema);
