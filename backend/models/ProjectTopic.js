const mongoose = require("mongoose");

const projectTopicSchema = new mongoose.Schema({
    alumniId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    topic: { type: String, required: true },
    description: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("ProjectTopic", projectTopicSchema);
