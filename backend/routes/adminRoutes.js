const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const adminAuthMiddleware = require("../middleware/adminAuthMiddleware");
//const User = require("../models/User");  // Add this line

const router = express.Router();

// Admin Login
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {

        console.log("Admin not found in database");
        return res.status(400).json({ message: "Admin not found" });
    }

    console.log("Admin found:", admin);

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password match result:", isMatch);

    if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// router.post("/add-user",adminAuthMiddleware, async (req, res) => {
//     try {
//         const { name, email, password, role } = req.body;

//         // Check if user already exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         // Hash password before saving
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create new user
//         const newUser = new User({ name, email, password: hashedPassword, role });
//         await newUser.save();

//         res.status(201).json({ message: "User added successfully", newUser });
//     } catch (error) {
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// });

module.exports = router;
