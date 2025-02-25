const Analytics = require("../models/analyticsModel");
const User = require("../models/user");
const Project = require("../models/project");

exports.getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeUsers = await User.count({ where: { is_active: "Y" } });
    const inactiveUsers = totalUsers - activeUsers;

    const totalProjects = await Project.count();
    const completedProjects = await Project.count({ where: { status_desc: "Completed" } });
    const ongoingProjects = totalProjects - completedProjects;

    res.json({
      totalUsers,
      activeUsers,
      inactiveUsers,
      totalProjects,
      completedProjects,
      ongoingProjects,
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ error: "Failed to retrieve analytics data" });
  }
};
