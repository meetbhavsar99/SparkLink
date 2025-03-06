const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");

router.get("/logs", AdminController.getLogs);
router.get("/projects", AdminController.getProjects);
router.get("/users-summary", AdminController.getUsersSummary);
router.get("/notifications", AdminController.getNotifications);
router.get("/analytics", AdminController.getAnalytics);

module.exports = router;
