const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure user is authenticated

// Alumni - Add Internship
router.post('/add', authMiddleware, async (req, res) => {
    try {
        const { title, company, location, description, stipend, duration } = req.body;
        const newInternship = new Internship({
            title,
            company,
            location,
            description,
            stipend,
            duration,
            postedBy: req.user.id // Extract alumni ID from token
        });
        await newInternship.save();
        res.status(201).json({ message: "Internship added successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Students - Get All Internships
router.get('/all', async (req, res) => {
    try {
        const internships = await Internship.find().populate('postedBy', 'name company');
        res.status(200).json(internships);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



// Get internship details by ID
router.get("/:id", async (req, res) => {
    try {
      const internship = await Internship.findById(req.params.id).populate("postedBy", "name");
      if (!internship) {
        return res.status(404).json({ message: "Internship not found" });
      }
      res.json(internship);
    } catch (err) {
      console.error("Error fetching internship details:", err);
      res.status(500).json({ message: "Failed to fetch internship details" });
    }
  });


  module.exports = router;