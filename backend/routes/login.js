const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import User model
const router = express.Router();
require("dotenv").config(); // Load environment variables

// Login Route
//const bcrypt = require("bcryptjs"); // Ensure bcrypt is imported

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("📌 Login Attempt for Email:", email);
    console.log("📌 Entered Password:", password);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User Not Found");
      return res.status(400).json({ message: "Invalid email or password" });
    }

    console.log("✅ User Found in DB:", user);
    console.log("📌 Stored Hashed Password:", user.password);

    // Check if bcrypt.compare() is working correctly
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error("❌ bcrypt.compare() Error:", err);
        return res.status(500).json({ message: "Server error" });
      }
      console.log("📌 bcrypt.compare() Result:", isMatch);

      if (!isMatch) {
        console.log("❌ Password Mismatch!");
        return res.status(400).json({ message: "Invalid email or password" });
      }

      console.log("✅ Password Matched!");
      res.status(200).json({ message: "Login successful" });
    });

  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
