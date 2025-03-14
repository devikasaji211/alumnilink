const express = require("express");
const ProjectTopic = require("../models/ProjectTopic");
const ProjectIdea = require("../models/ProjectIdea");

const router = express.Router();

// 📌 1️⃣ Alumni posts a project field/topic
router.post("/topics", async (req, res) => {
    try {
        console.log("🔹 Incoming request to /topics");  // Debugging Log

        const { alumniId, topic, description } = req.body;
        console.log("📝 Request Body:", req.body);  // Log request data

        // Validate input fields
        if (!alumniId || !topic || !description) {
            console.log("❌ Missing required fields");
            return res.status(400).json({ error: "All fields are required: alumniId, topic, and description" });
        }

        // Create a new topic and save it to the database
        const newTopic = new ProjectTopic({ alumniId, topic, description });
        await newTopic.save();

        console.log("✅ Topic saved successfully:", newTopic);  // Debugging Log
        res.status(201).json({ message: "Project topic added successfully", newTopic });

    } catch (error) {
        console.error("❌ Error posting topic:", error.message);  // Log error details
        res.status(500).json({ error: error.message });
    }
});

// 📌 2️⃣ Students fetch available project fields/topics
router.get("/topics", async (req, res) => {
  try {
    const topics = await ProjectTopic.find().populate("alumniId", "name");
    console.log("📌 Populated Topics:", topics); // Debugging Log
    res.json(topics);
  } catch (error) {
    console.error("❌ Error fetching topics:", error.message);
    res.status(500).json({ error: error.message });
  }
});



// 📌 3️⃣ Students submit a project idea
router.post("/ideas", async (req, res) => {
  try {
    const { studentId, topicId, description } = req.body;
    const newIdea = new ProjectIdea({ studentId, topicId, description });
    await newIdea.save();
    res.status(201).json({ message: "Project idea submitted successfully", newIdea });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 4️⃣ Alumni fetch submitted project ideas under their topics
router.get("/ideas/:alumniId", async (req, res) => {
  try {
    const { alumniId } = req.params;
    const topics = await ProjectTopic.find({ alumniId });

    const topicIds = topics.map(topic => topic._id);
    const projectIdeas = await ProjectIdea.find({ topicId: { $in: topicIds } })
      .populate("studentId", "name")
      .populate("topicId", "topic");

    res.json(projectIdeas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 5️⃣ Alumni accept/reject project ideas with feedback
router.put("/ideas/:ideaId", async (req, res) => {
  try {
    const { ideaId } = req.params;
    const { status, feedback } = req.body;

    const validStatuses = ["Accepted", "Rejected", "Under Discussion"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const updatedIdea = await ProjectIdea.findByIdAndUpdate(
      ideaId,
      { status, feedback },
      { new: true }
    );

    res.json({ message: "Project idea updated successfully", updatedIdea });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 📌 6️⃣ Students track their submitted ideas
router.get("/ideas/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;
    const studentIdeas = await ProjectIdea.find({ studentId })
      .populate("topicId", "topic")
      .populate("studentId", "name");

    res.json(studentIdeas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
