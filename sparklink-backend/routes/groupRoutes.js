// routes/groupRoutes.js
const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const groupController = require("../controllers/groupController");
const GroupMember = require("../models/group_member");
const Group = require("../models/group");
const upload = require("../middlewares/uploadMiddleware");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

router.post("/create", isAuthenticated, groupController.createGroup);
router.post("/join", isAuthenticated, groupController.joinGroup);
router.post("/leave", isAuthenticated, groupController.leaveGroup);
router.post("/upload", isAuthenticated, upload.single("pdf"), groupController.uploadPDF);
router.get("/all", isAuthenticated, groupController.getGroups);
router.get("/my", isAuthenticated, groupController.getMyGroup);

router.get("/view-resume", isAuthenticated, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const Group = require("../models/group");
    const GroupMember = require("../models/group_member");

    const membership = await GroupMember.findOne({ where: { user_id } });
    if (!membership) return res.status(403).json({ message: "You are not in any group." });

    const group = await Group.findByPk(membership.group_id);
    if (!group || !group.resume_pdf) return res.status(404).json({ message: "Resume not found." });

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

router.get("/admin-view", isAuthenticated, groupController.getAllDetailedGroups);

router.get("/admin-download-resume", isAuthenticated, async (req, res) => {
  try {
    const groupId = req.query.groupId;

    const group = await Group.findByPk(groupId);
    if (!group || !group.resume_pdf) return res.status(404).json({ message: "Resume not found." });

    const filePath = path.resolve(__dirname, "..", group.resume_pdf);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "File not found on disk." });

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

// router.get("/my-group", isAuthenticated, groupController.getMyGroup);





// router.get("/my", isAuthenticated, async (req, res) => {
//   try {
//     const user_id = req.user.user_id;

//     const membership = await GroupMember.findOne({ where: { user_id } });
//     if (!membership) return res.status(404).json({ message: "Not in any group" });

//     const group = await Group.findByPk(membership.group_id, {
//       include: [{
//         model: GroupMember,
//         as: "members",
//         include: [{ model: User, attributes: ["user_id", "username"] }],
//       }]
//     });

//     const formattedGroup = {
//       group_id: group.group_id,
//       resume_url: group.resume_pdf ? `${process.env.SERVER_BASE_URL}/${group.resume_pdf}` : null,
//       team_leader_id: group.team_leader_id,
//       team_leader_name: group.members.find(m => m.user_id === group.team_leader_id)?.user?.username,
//       members: group.members.map(m => ({
//         user_id: m.user_id,
//         username: m.user?.username,
//         is_leader: m.user_id === group.team_leader_id
//       }))
//     };

//     res.status(200).json({ group: formattedGroup, isLeader: user_id === group.team_leader_id });
//   } catch (error) {
//     console.error("Error fetching group info:", error);
//     res.status(500).json({ message: "Error fetching group info" });
//   }
// });


module.exports = router;
