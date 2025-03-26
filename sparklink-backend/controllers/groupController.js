// controllers/groupController.js
const Group = require("../models/group");
const GroupMember = require("../models/group_member");
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Create Group
exports.createGroup = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Check if already in a group
    const existingMembership = await GroupMember.findOne({ where: { user_id } });
    if (existingMembership) {
      return res.status(400).json({ message: "You are already in a group." });
    }

    // Auto-generate numeric group ID
    const lastGroup = await Group.findOne({ order: [['group_id', 'DESC']] });
    const nextGroupId = lastGroup ? parseInt(lastGroup.group_id) + 1 : 1001;

    const group = await Group.create({
      group_id: nextGroupId,
      team_leader_id: user_id,
    });

    await GroupMember.create({ group_id: nextGroupId, user_id });

    res.status(201).json({ message: "Group created", group });
  } catch (error) {
    console.error("Error creating group:", error);
    res.status(500).json({ message: "Error creating group" });
  }
};



// Join Group
exports.joinGroup = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { group_id } = req.body;

    // Check if group exists
    const group = await Group.findByPk(group_id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Check if user is already in a group
    const alreadyInGroup = await GroupMember.findOne({ where: { user_id } });
    if (alreadyInGroup) return res.status(400).json({ message: "You are already in a group." });

    // Check group size
    const memberCount = await GroupMember.count({ where: { group_id } });
    if (memberCount >= 5) {
      return res.status(400).json({ message: "This group already has 5 members." });
    }

    // Add user to group
    await GroupMember.create({ group_id, user_id });

    res.status(200).json({ message: "Joined group successfully" });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ message: "Error joining group" });
  }
};


// Leave Group
exports.leaveGroup = async (req, res) => {
  try {
    const user_id = req.user.user_id; // ✅ Correct source

    const membership = await GroupMember.findOne({ where: { user_id } });
    if (!membership) return res.status(404).json({ message: "Not in a group" });

    await GroupMember.destroy({ where: { user_id } });

    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ message: "Error leaving group" });
  }
};


// Upload PDF
exports.uploadPDF = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const membership = await GroupMember.findOne({ where: { user_id } });
    if (!membership) return res.status(400).json({ message: "Not part of any group" });

    const group = await Group.findByPk(membership.group_id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const filePath = req.file.path;

    const relativePath = path.join("uploads", "group_pdfs", req.file.filename);
    group.resume_pdf = relativePath;

    await group.save();

    res.status(200).json({ message: "PDF uploaded", path: filePath });
  } catch (error) {
    console.error("Error uploading PDF:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// View Groups
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      include: [{ model: GroupMember, as: "members" }],
    });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ message: "Error fetching groups" });
  }
};

// Get all groups with members and team leader (for Admins/Supervisors)
exports.getAllDetailedGroups = async (req, res) => {
  try {
    // ✅ Prevent duplicate association error
    if (!Group.associations.GroupMembers) {
      Group.hasMany(GroupMember, { foreignKey: 'group_id', as: 'GroupMembers' });
    }

    if (!GroupMember.associations.User) {
      GroupMember.belongsTo(User, { foreignKey: 'user_id' });
    }

    const groups = await Group.findAll({
      include: [
        {
          model: GroupMember,
          as: 'GroupMembers',
          include: [
            {
              model: User,
              attributes: ['username', 'user_id']
            }
          ]
        }
      ]
    });

    const formatted = groups.map(group => ({
      group_id: group.group_id,
      team_leader_id: group.team_leader_id,
      resume_url: group.resume_pdf,
      members: group.GroupMembers.map(member => ({
        user_id: member.user_id,
        username: member.User?.username || "Unknown",
        is_leader: member.user_id === group.team_leader_id
      }))
    }));

    console.log("Formatted groups:", formatted);
    res.status(200).json({ groups: formatted });
  } catch (error) {
    console.error("Error fetching all groups:", error);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};



// Add in groupController.js
exports.getMyGroup = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const membership = await GroupMember.findOne({ where: { user_id } });
    if (!membership) {
      return res.status(200).json({ group: null, isLeader: false });
    }

    // Manually associate here
    GroupMember.belongsTo(User, { foreignKey: 'user_id' });
    Group.hasMany(GroupMember, { foreignKey: 'group_id' });

    const group = await Group.findOne({
      where: { group_id: membership.group_id },
      include: [
        {
          model: GroupMember,
          as: "GroupMembers", // ❗Use default alias Sequelize generates (or match your actual naming)
          include: [{ model: User, attributes: ['username', 'user_id'] }]
        }
      ]
    });

    const formattedMembers = group.GroupMembers.map(member => ({
      user_id: member.user_id,
      username: member.User?.username || "Unknown",
      is_leader: member.user_id === group.team_leader_id
    }));

    const leader = await User.findByPk(group.team_leader_id);

    res.status(200).json({
      group: {
        group_id: group.group_id,
        resume_url: group.resume_pdf || null,
        members: formattedMembers,
        team_leader_name: leader?.username || "N/A"
      },
      isLeader: user_id === group.team_leader_id
    });
  } catch (err) {
    console.error("Error fetching group info:", err);
    res.status(500).json({ message: "Error fetching group info" });
  }
};


