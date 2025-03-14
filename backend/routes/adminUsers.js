const express = require("express");
const router = express.Router();
const AdminUser = require("../models/AdminUserModel");

// Route to fetch all admin users
router.get("/users", async (req, res) => {
    try {
        const users = await AdminUser.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Route to add a new admin user
router.post("/add-user", async (req, res) => {
    try {
        const { admissionNumber, name, email } = req.body;

        // Check if the user already exists
        const existingUser = await AdminUser.findOne({ admissionNumber });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new AdminUser({ admissionNumber, name, email });
        await newUser.save();

        res.status(201).json({ message: "User added successfully", newUser });
    } catch (error) {
        res.status(500).json({ message: "Error adding user" });
    }
});

module.exports = router;
