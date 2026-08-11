const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");

router.get("/profile", protect, async (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
