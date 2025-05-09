/**
 * Admin Routes
 * Handles endpoints for retrieving logs, project summaries, user analytics,
 * admin-level notifications, and categorized logs.
 */
const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");
const AdminLogsController = require("../controllers/adminLogsController");

// Routes for general admin-related operations
router.get("/logs", AdminController.getLogs);
router.get("/logs/users", adminController.getUserLogs);
router.get("/logs/actions", adminController.getActionLogs);
router.get("/logs/errors", adminController.getErrorLogs);
router.get("/projects", AdminController.getProjects);
router.get("/users-summary", AdminController.getUsersSummary);
router.get("/notifications", AdminController.getNotifications);
router.get("/analytics", AdminController.getAnalytics);
router.get("/admin-logs", AdminLogsController.getAllLogs);
router.get("/admin-logs/:type", AdminLogsController.getLogsByType);

module.exports = router;
