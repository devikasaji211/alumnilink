const express = require('express');
const router = express.Router();
const Bookmark = require('../models/Bookmark');

// Remove '/api' prefix since it should be handled by app.use() in main server file
router.get('/bookmarks', async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id });
    res.json(bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
