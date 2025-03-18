const express = require("express");
const router = express.Router();
const logsController = require("../controllers/logsController");

//router.get("/logs", logsController.getAllLogs);
router.get("/logs", logsController.getLogs);
router.get("/logs/filter", logsController.getFilteredLogs);

module.exports = router;
