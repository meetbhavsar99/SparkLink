/**
 * Group Routes
 * Handles all student group operations such as creation, joining, leaving,
 * resume upload/download, project association, and admin views.
 */

// routes/groupRoutes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const groupController = require("../controllers/groupController");
const GroupMember = require("../models/group_member");
const Group = require("../models/group");
const upload = require("../middlewares/uploadMiddleware");

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

router.post("/create", isAuthenticated, groupController.createGroup);
router.post("/join", isAuthenticated, groupController.joinGroup);
router.post("/leave", isAuthenticated, groupController.leaveGroup);
router.post(
  "/upload",
  isAuthenticated,
  upload.single("pdf"),
  groupController.uploadPDF
);
router.get("/all", isAuthenticated, groupController.getGroups);
router.get("/my", isAuthenticated, groupController.getMyGroup);

router.get("/view-resume", isAuthenticated, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const Group = require("../models/group");
    const GroupMember = require("../models/group_member");

    const membership = await GroupMember.findOne({ where: { user_id } });
    if (!membership)
      return res.status(403).json({ message: "You are not in any group." });

    const group = await Group.findByPk(membership.group_id);
    if (!group || !group.resume_pdf)
      return res.status(404).json({ message: "Resume not found." });

    const filePath = path.resolve(__dirname, "..", group.resume_pdf);
    console.log("Resolved file path:", filePath);

    if (!fs.existsSync(filePath)) {
      console.error("File does not exist:", filePath);
      return res.status(404).json({ message: "File not found on disk." });
    }

    res.download(filePath, "merged_resume.pdf", (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).json({ message: "Error downloading file." });
      }
    });
  } catch (error) {
    console.error("Error sending resume PDF:", error);
    res.status(500).json({ message: "Error retrieving resume." });
  }
});

router.get(
  "/admin-view",
  isAuthenticated,
  groupController.getAllDetailedGroups
);

router.get("/admin-download-resume", isAuthenticated, async (req, res) => {
  try {
    const groupId = req.query.groupId;

    const group = await Group.findByPk(groupId);
    if (!group || !group.resume_pdf)
      return res.status(404).json({ message: "Resume not found." });

    const filePath = path.resolve(__dirname, "..", group.resume_pdf);
    if (!fs.existsSync(filePath))
      return res.status(404).json({ message: "File not found on disk." });

    res.download(filePath, "merged_resume.pdf", (err) => {
      if (err) {
        console.error("Download error:", err);
        return res.status(500).json({ message: "Error downloading file." });
      }
    });
  } catch (error) {
    console.error("Admin download error:", error);
    res.status(500).json({ message: "Error retrieving resume." });
  }
});

router.get("/my-projects", isAuthenticated, groupController.getMyGroupProjects);

module.exports = router;
