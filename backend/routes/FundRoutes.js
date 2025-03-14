const express = require("express");
const multer = require("multer");
const FundRequest = require("../models/FundRequest");
const Contribution = require("../models/Contribution");
const mongoose = require("mongoose");

const router = express.Router();

// 🔹 Setup Multer for File Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

// ✅ 1. Student submits a fund request
router.post("/fundrequests", async (req, res) => {
    console.log("📥 Fund Request API Hit!");
    console.log("🔹 Request Body:", req.body);

    try {
        const { studentId, purpose, amount, description } = req.body;

        // Debug: Ensure required fields are received
        if (!studentId || !purpose || !amount || !description) {
            console.log("❌ Missing required fields:", { studentId, purpose, amount, description });
            return res.status(400).json({ error: "All fields are required" });
        }

        // Debug: Check if studentId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            console.log("❌ Invalid ObjectId format:", studentId);
            return res.status(400).json({ error: "Invalid student ID format" });
        }

        const studentObjectId = new mongoose.Types.ObjectId(studentId);
        console.log("✅ Converted studentId to ObjectId:", studentObjectId);

        const fundRequest = new FundRequest({
            studentId: studentObjectId,
            purpose,
            amount,
            description,
            remainingAmount: amount,
        });

        await fundRequest.save();
        console.log("✅ Fund Request Saved Successfully:", fundRequest);

        res.status(201).json({ message: "Fund request submitted", fundRequest });
    } catch (error) {
        console.error("❌ Error submitting request:", error);
        res.status(500).json({ error: "Error submitting request", details: error.message });
    }
});


// ✅ 2. Get student's fund requests
router.get("/fundrequests/student/:studentId", async (req, res) => {
    console.log("📢 Fund Requests API Called for Student:", req.params.studentId);

    try {
        // Debugging: Print raw studentId
        console.log("🔍 Received Student ID:", req.params.studentId);

        // Ensure valid ObjectId
        const studentObjectId = new mongoose.Types.ObjectId(req.params.studentId);
        console.log("✅ Converted to ObjectId:", studentObjectId);

        // Fetch requests
        const requests = await FundRequest.find({ studentId: studentObjectId });

        console.log("🔹 Found Requests:", requests);

        res.status(200).json(requests);
    } catch (error) {
        console.error("❌ Error fetching fund requests:", error);
        res.status(500).json({ error: "Error fetching requests", details: error.message });
    }
});

// ✅ 3. Get all pending fund requests (for admin)
router.get("/fundrequests", async (req, res) => {
    try {
        const requests = await FundRequest.find(); // Get all fund requests
        res.status(200).json(requests);
    } catch (error) {
        console.error("Error fetching all fund requests:", error);
        res.status(500).json({ error: "Error fetching requests" });
    }
});


// ✅ 4. Admin approves or rejects requests
router.put("/fundrequests/:id", async (req, res) => {
    try {
        const { status } = req.body;
        const updatedRequest = await FundRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
        res.status(200).json(updatedRequest);
    } catch (error) {
        res.status(500).json({ error: "Error updating status" });
    }
});

// ✅ 5. Get all approved requests for alumni
// ✅ 5. Get all approved requests for alumni
router.get("/fundrequests/approved", async (req, res) => {
    try {
        const approvedRequests = await FundRequest.find({ status: "Approved" });
        res.status(200).json(approvedRequests);
    } catch (error) {
        res.status(500).json({ error: "Error fetching approved requests" });
    }
});


// ✅ 6. Alumni contribute to fund requests
router.post("/contributions", upload.single("paymentScreenshot"), async (req, res) => {
    try {
        console.log("📥 Contribution API Hit!");
        console.log("🔹 Request Body:", req.body);
        console.log("🔹 File Received:", req.file);

        const { requestId, alumniId, amount } = req.body;
        const paymentScreenshot = req.file ? req.file.path : null;

        // Check if required fields are present
        if (!requestId || !alumniId || !amount) {
            console.log("❌ Missing required fields:", { requestId, alumniId, amount });
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if requestId and alumniId are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(requestId) || !mongoose.Types.ObjectId.isValid(alumniId)) {
            console.log("❌ Invalid ObjectId format:", requestId, alumniId);
            return res.status(400).json({ error: "Invalid request ID or alumni ID" });
        }

        const contribution = new Contribution({ requestId, alumniId, amount, paymentScreenshot });
        await contribution.save();

        // Update remaining amount in fund request
        const fundRequest = await FundRequest.findById(requestId);
        if (!fundRequest) {
            console.log("❌ Fund Request Not Found:", requestId);
            return res.status(404).json({ error: "Fund request not found" });
        }

        fundRequest.remainingAmount -= amount;
        await fundRequest.save();

        console.log("✅ Contribution Saved Successfully:", contribution);
        res.status(201).json({ message: "Contribution recorded", contribution });

    } catch (error) {
        console.error("❌ Error saving contribution:", error);
        res.status(500).json({ error: "Error saving contribution" });
    }
});

// ✅ 7. Get all contributions (for admin)
router.get("/contributions", async (req, res) => {
    try {
        const contributions = await Contribution.find()
            .populate("alumniId", "name")  // Get alumni name
            .populate("requestId", "purpose amount remainingAmount"); // Get fund request details

        res.json(contributions);
    } catch (error) {
        console.error("Error fetching contributions:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// Get past contributions by a specific alumni
router.get("/past-contributions/:alumniId", async (req, res) => {
    try {
        const { alumniId } = req.params;

        // Convert alumniId to ObjectId
        const objectId = new mongoose.Types.ObjectId(alumniId); // Convert to ObjectId
        const contributions = await Contribution.find({ alumniId: objectId }).populate("requestId");

        if (!contributions.length) {
            return res.status(404).json({ message: "No past contributions found." });
        }

        res.json(contributions);
    } catch (error) {
        console.error("Error fetching past contributions:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});


module.exports = router;
