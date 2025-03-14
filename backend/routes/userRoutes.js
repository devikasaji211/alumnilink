const express = require("express");
const { getUserProfile, updateUserProfile } = require("../controllers/UserController");

const authMiddleware = require("../middleware/authMiddleware");
//const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

module.exports = router;
