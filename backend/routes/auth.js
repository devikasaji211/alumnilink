const express = require("express");
const router = express.Router(); // ✅ Define router
const AdminUser = require("../models/AdminUserModel"); // Import your model

router.post("/check-user", async (req, res) => {
    try {
        const admissionNumber = String(req.body.admissionNumber).trim().toUpperCase(); // Normalize input
        const name = req.body.name.trim().toLowerCase(); // Normalize input

        console.log("🔍 Checking user:", { admissionNumber, name });

        // Fetch user from the database with case-insensitive comparison
        const user = await AdminUser.findOne({
            admissionNumber: { $regex: new RegExp(`^${admissionNumber}$`, "i") },
            name: { $regex: new RegExp(`^${name}$`, "i") }
        });

        if (user) {
            console.log("✅ User found:", user);
            return res.json({ success: true, message: "User exists in database" });
        } else {
            console.log("❌ User not found in records:", { admissionNumber, name });
            return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (error) {
        console.error("❌ Error checking user:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



module.exports = router; // ✅ Export router
