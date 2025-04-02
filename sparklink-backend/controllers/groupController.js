const Group = require("../models/group");
const GroupMember = require("../models/group_member");
const User = require("../models/user");
const Project = require("../models/project");
const ProjAllocation = require("../models/proj_allocation");
const ProjApplication = require("../models/proj_application");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

// Create a new group and make the creator the team leader
exports.createGroup = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Check if already in a group
    const existingMembership = await GroupMember.findOne({
      where: { user_id },
    });
    if (existingMembership) {
      return res.status(400).json({ message: "You are already in a group." });
    }

    // Auto-generate numeric group ID
    const lastGroup = await Group.findOne({ order: [["group_id", "DESC"]] });
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

// Join an existing group if not already in one and group has space
exports.joinGroup = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { group_id } = req.body;

    // Check if group exists
    const group = await Group.findByPk(group_id);
    if (!group) return res.status(404).json({ message: "Group not found" });

    // Check if user is already in a group
    const alreadyInGroup = await GroupMember.findOne({ where: { user_id } });
    if (alreadyInGroup)
      return res.status(400).json({ message: "You are already in a group." });

    // Check group size
    const memberCount = await GroupMember.count({ where: { group_id } });
    if (memberCount >= 7) {
      return res
        .status(400)
        .json({ message: "This group already has 7 members." });
    }

    // Add user to group
    await GroupMember.create({ group_id, user_id });

    res.status(200).json({ message: "Joined group successfully" });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ message: "Error joining group" });
  }
};

// Allow users to leave their group
exports.leaveGroup = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const membership = await GroupMember.findOne({ where: { user_id } });
    if (!membership) return res.status(404).json({ message: "Not in a group" });

    await GroupMember.destroy({ where: { user_id } });

    res.status(200).json({ message: "Left group successfully" });
  } catch (error) {
    console.error("Error leaving group:", error);
    res.status(500).json({ message: "Error leaving group" });
  }
};

// Upload a merged resume PDF for the group (by any member)
exports.uploadPDF = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const membership = await GroupMember.findOne({ where: { user_id } });
    if (!membership)
      return res.status(400).json({ message: "Not part of any group" });

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

// Fetch all groups with their members (basic)
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

// Admin/Supervisor view: Fetch all groups with member and leader info
exports.getAllDetailedGroups = async (req, res) => {
  try {
    if (!Group.associations.GroupMembers) {
      Group.hasMany(GroupMember, {
        foreignKey: "group_id",
        as: "GroupMembers",
      });
    }

    if (!GroupMember.associations.User) {
      GroupMember.belongsTo(User, { foreignKey: "user_id" });
    }

    const groups = await Group.findAll({
      include: [
        {
          model: GroupMember,
          as: "GroupMembers",
          include: [
            {
              model: User,
              attributes: ["username", "user_id"],
            },
          ],
        },
      ],
    });

    const formatted = await Promise.all(
      groups.map(async (group) => {
        const apps = await ProjApplication.findAll({
          where: {
            user_id: group.team_leader_id,
            role: 4,
            is_active: "Y",
          },
          include: [
            {
              model: Project,
              as: "project",
              attributes: ["proj_id", "project_name"],
            },
          ],
        });

        const applied_projects = apps.map((a) => ({
          proj_id: a.proj_id,
          project_name: a.project?.project_name || "Unknown",
          priority: a.priority || "N/A",
        }));

        return {
          group_id: group.group_id,
          team_leader_id: group.team_leader_id,
          resume_url: group.resume_pdf,
          members: group.GroupMembers.map((member) => ({
            user_id: member.user_id,
            username: member.User?.username || "Unknown",
            is_leader: member.user_id === group.team_leader_id,
          })),
          applied_projects, // ✅ now included
        };
      })
    );

    console.log("Formatted groups with applied_projects:", formatted); // ✅ confirm output
    res.status(200).json({ groups: formatted });
  } catch (error) {
    console.error("Error fetching all groups:", error);
    res.status(500).json({ message: "Failed to fetch groups" });
  }
};

// Get the current user's group info and their members
exports.getMyGroup = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const membership = await GroupMember.findOne({ where: { user_id } });
    if (!membership) {
      return res.status(200).json({ group: null, isLeader: false });
    }

    // Manually associate here
    GroupMember.belongsTo(User, { foreignKey: "user_id" });
    Group.hasMany(GroupMember, { foreignKey: "group_id" });

    const group = await Group.findOne({
      where: { group_id: membership.group_id },
      include: [
        {
          model: GroupMember,
          as: "GroupMembers",
          include: [{ model: User, attributes: ["username", "user_id"] }],
        },
      ],
    });

    const formattedMembers = group.GroupMembers.map((member) => ({
      user_id: member.user_id,
      username: member.User?.username || "Unknown",
      is_leader: member.user_id === group.team_leader_id,
    }));

    const leader = await User.findByPk(group.team_leader_id);

    res.status(200).json({
      group: {
        group_id: group.group_id,
        resume_url: group.resume_pdf || null,
        members: formattedMembers,
        team_leader_name: leader?.username || "N/A",
      },
      isLeader: user_id === group.team_leader_id,
    });
  } catch (err) {
    console.error("Error fetching group info:", err);
    res.status(500).json({ message: "Error fetching group info" });
  }
};

// Get list of projects that the group (via team leader) is working on
exports.getMyGroupProjects = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const membership = await GroupMember.findOne({ where: { user_id } });
    if (!membership)
      return res.status(403).json({ message: "You are not in any group." });

    const group = await Group.findByPk(membership.group_id);
    if (!group) return res.status(404).json({ message: "Group not found." });

    const leaderId = group.team_leader_id;

    const allocations = await ProjAllocation.findAll({
      where: { user_id: leaderId, is_active: "Y" },
    });

    const projectIds = allocations.map((a) => a.proj_id);
    const projects = await Project.findAll({ where: { proj_id: projectIds } });

    console.log("Leader ID:", leaderId);
    console.log("Project IDs for leader:", projectIds);
    console.log(
      "Projects fetched:",
      projects.map((p) => p.project_name)
    );

    return res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching group projects:", error);
    return res.status(500).json({ message: "Error fetching group projects" });
  }
};

exports.getMyGroupAppliedProjects = async (req, res) => {
  try {
    const user_id = req.user.user_id;

    const membership = await GroupMember.findOne({ where: { user_id } });
    if (!membership)
      return res.status(403).json({ message: "You are not in any group." });

    const group = await Group.findByPk(membership.group_id);
    if (!group) return res.status(404).json({ message: "Group not found." });

    const leaderId = group.team_leader_id;

    // ✅ JOIN project applications with projects
    const applications = await ProjApplication.findAll({
      where: {
        user_id: leaderId,
        role: 4,
        is_active: "Y",
      },
      include: [
        {
          model: Project,
          as: "project", // ✅ Must match alias in proj_application.js
          attributes: ["proj_id", "project_name"],
        },
      ],
    });

    const formatted = applications.map((app) => ({
      proj_id: app.proj_id,
      project_name: app.project?.project_name || "Unknown",
      priority: app.priority || "N/A",
    }));

    return res.status(200).json({ appliedProjects: formatted });
  } catch (error) {
    console.error("Error fetching applied projects with priority:", error);
    return res.status(500).json({ message: "Error fetching applied projects" });
  }
};
