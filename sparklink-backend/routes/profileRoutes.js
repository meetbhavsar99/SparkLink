/**
 * Profile Routes
 * Handles fetching and creation of user profiles based on role.
 */

const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

router.get("/", profileController.getProfile);
router.post("/create-profile", profileController.createProfile);

module.exports = router;
