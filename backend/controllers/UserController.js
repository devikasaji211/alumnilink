const Alumni = require("../models/AlumniModel");
const Student = require("../models/StudentModel");

// ✅ Get user profile
const getUserProfile = async (req, res) => {
    try {
        console.log("Decoded Token in Profile Route:", req.user); // ✅ Debugging

        if (!req.user || !req.user.userId) {
            console.log("Authorization failed: Invalid token");
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }

        const userId = req.user.userId;
        const role = req.user.role; // Ensure role is correctly passed in token
        console.log("Extracted userId:", userId); // ✅ Debugging
        console.log("Extracted role:", role); // ✅ Debugging

        let user;
        if (role === "Alumni") {
            console.log("Querying Alumni collection...");
            user = await Alumni.findOne({ userId });
        } else if (role === "Student") {
            console.log("Querying Student collection...");
            user = await Student.findOne({ userId });
        }

        res.json(user);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Update user profile
const updateUserProfile = async (req, res) => {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }

        const userId = req.user.userId; // ✅ Extract userId from token

        // ✅ Search using `userId` for students, `_id` for alumni
        let user = await Alumni.findById(userId) || await Student.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ✅ Update only the fields that are provided
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined) {
                user[key] = req.body[key];
            }
        });

        await user.save();
        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    getUserProfile: getUserProfile,
    updateUserProfile: updateUserProfile
};


