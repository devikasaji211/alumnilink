const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const verifyToken = require("../middleware/auth"); // Ensure middleware is correct
const User = require("../models/User"); // Ensure correct path

// 🟢 Student: Ask a Question
router.post("/ask", verifyToken, async (req, res) => {
  try {
    console.log("🔍 Received request:", req.body);
    console.log("🛡️ User from token:", req.user);

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    if (!req.user || !req.user.id || !req.user.name) {
      return res.status(401).json({ message: "Unauthorized. User details missing." });
    }

    const newQuestion = new Question({
      studentId: req.user.id,
      studentName: req.user.name, // Extracted from token
      question,
    });

    await newQuestion.save();
    console.log("✅ Question saved:", newQuestion);

    res.status(201).json({ message: "Question posted successfully!", question: newQuestion });
  } catch (error) {
    console.error("❌ Error in /ask route:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// 🟢 Alumni: Get All Unanswered Questions
router.get("/questions", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "Alumni") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const questions = await Question.find({ answer: { $in: [null, ""] } })
      .select("studentName question answer alumniName")
      .lean();

    const updatedQuestions = await Promise.all(
      questions.map(async (q) => {
        if (!q.alumniName && q.alumniId) {
          const alumni = await User.findById(q.alumniId).select("name");
          q.alumniName = alumni ? alumni.name : "Unknown Alumni";
        }
        return q;
      })
    );

    console.log("📌 Questions Sent to Frontend:", updatedQuestions); // ✅ Debugging log
    res.json(updatedQuestions);
  } catch (error) {
    console.error("❌ Error in /questions route:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// 🟢 Alumni: Reply to a Question
router.post("/reply/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { answer } = req.body;

    if (req.user.role !== "Alumni") {
      return res.status(403).json({ message: "Access Denied" });
    }

    const alumni = await User.findById(req.user.id).select("name");
    if (!alumni) {
      return res.status(404).json({ message: "Alumni not found" });
    }

    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    question.answer = answer;
    question.alumniId = req.user.id;
    question.alumniName = req.user.name || "Anonymous Alumni"; // Ensure alumniName is always stored

    await question.save();
    res.json({ message: "Reply sent successfully!", updatedQuestion: question });
  } catch (error) {
    console.error("❌ Error in /reply route:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// 🟢 Student: Get Their Own Questions and Answers
router.get("/my-questions", verifyToken, async (req, res) => {
  try {
    const questions = await Question.find({ studentId: req.user.id })
      .select("studentName question answer alumniName"); // ✅ Ensure alumniName is included

    res.json(questions);
  } catch (error) {
    console.error("❌ Error in /my-questions route:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
