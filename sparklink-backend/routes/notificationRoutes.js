/**
 * Notification Routes
 * Manages in-app notification retrieval, status updates, and email triggers.
 */

const express = require("express");
const router = express.Router();
const notificationsController = require("../controllers/notificationController");
const {
  fetchNotifications,
  fetchNotificationCount,
  NotificationOkay,
} = require("../controllers/notificationController");

router.get("/", fetchNotifications);
router.get("/count", fetchNotificationCount);
router.post("/okay", NotificationOkay);
router.post(
  "/project-created",
  notificationsController.sendProjectCreatedEmails
);

module.exports = router;
