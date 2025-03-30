const express = require("express");
const {
  getSettings,
  updateSettings,
} = require("../controllers/systemSettingsController");
const router = express.Router();

// GET: Fetch system settings
router.get("/", getSettings);

// PUT: Update system settings
router.put("/", updateSettings);

module.exports = router;
