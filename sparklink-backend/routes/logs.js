const express = require("express");
const router = express.Router();
const logsController = require("../controllers/logsController");


//router.get("/logs", logsController.getAllLogs);
router.get("/logs", logsController.getLogs);
router.get("/logs/filter", logsController.getFilteredLogs);
router.get('/download', logsController.downloadLogs);

router.get("/test", (req, res) => {
  console.log("🧪 /api/logs/test hit");
  res.send("Test route works!");
});


module.exports = router;
