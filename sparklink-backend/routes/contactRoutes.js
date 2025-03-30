/**
 * Contact Routes
 * Handles fetching contact page data and submitting contact form messages.
 */
const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");

// Define the GET route for fetching contact info
router.get("/", contactController.getContactInfo);

// Define a POST route to handle form submissions
router.post("/submit", contactController.submitContactForm);

module.exports = router;
