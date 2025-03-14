const express = require("express");
const multer = require("multer");
const Report = require("../models/Report");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");

const router = express.Router();

// Configure Multer for file uploads (storing images in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Add Report API
router.post("/add-report", adminAuthMiddleware, upload.single("image"), async (req, res) => {
    try {
        const { title, description, category, year, month } = req.body;
        const image = req.file ? req.file.buffer.toString("base64") : null; // Convert image to Base64

        const newReport = new Report({
            title,
            description,
            category,
            year,
            month,
            image, // Store image in database as Base64
        });

        await newReport.save();
        res.status(201).json({ message: "Report added successfully", report: newReport });
    } catch (error) {
        console.error("Error adding report:", error);
        res.status(500).json({ message: "Failed to add report" });
    }
});

// Get all reports
router.get("/get-reports", adminAuthMiddleware, async (req, res) => {
    try {
        const reports = await Report.find().sort({ date: -1 });
        res.status(200).json(reports);
    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
});

module.exports = router;
