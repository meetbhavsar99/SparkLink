/**
 * Edit Profile Routes
 * Handles fetching and updating user profile details based on role.
 */

const express = require("express");
const router = express.Router();
const editProfileController = require("../controllers/editProfileController");

router.get("/", editProfileController.getProfile);
router.post("/", editProfileController.updateProfile);
// router.post('/updateProfile', profileController.updateProfile);

module.exports = router;
