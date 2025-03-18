const express = require('express');
const router = express.Router();
const notificationsController = require("../controllers/notificationController");
const {
    fetchNotifications, fetchNotificationCount, NotificationOkay
  } = require('../controllers/notificationController');  // Adjust path as needed

router.get('/', fetchNotifications);
router.get('/count',fetchNotificationCount);
router.post('/okay',NotificationOkay);
router.post("/project-created", notificationsController.sendProjectCreatedEmails);

module.exports = router;
