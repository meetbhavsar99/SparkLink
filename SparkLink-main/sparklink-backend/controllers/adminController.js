const db = require("../models");

exports.getLogs = async (req, res) => {
  try {
    const logs = await db.Log.findAll({ limit: 10, order: [["timestamp", "DESC"]] });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await db.Project.findAll();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

exports.getUsersSummary = async (req, res) => {
  try {
    const totalUsers = await db.User.count();
    const students = await db.User.count({ where: { role: "student" } });
    const supervisors = await db.User.count({ where: { role: "supervisor" } });
    const businessOwners = await db.User.count({ where: { role: "business_owner" } });
    const admins = await db.User.count({ where: { role: "admin" } });

    res.json({ totalUsers, students, supervisors, businessOwners, admins });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user summary" });
  }
};
