const { Log } = require("../models"); // Ensure Log model is properly imported

exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({ order: [["timestamp", "DESC"]], limit: 20 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

// User Logs
exports.getUserLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({ where: { type: "user" }, order: [["timestamp", "DESC"]], limit: 20 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching user logs:", error);
    res.status(500).json({ error: "Failed to fetch user logs" });
  }
};

// Action Logs
exports.getActionLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({ where: { type: "action" }, order: [["timestamp", "DESC"]], limit: 20 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching action logs:", error);
    res.status(500).json({ error: "Failed to fetch action logs" });
  }
};

// Error Logs
exports.getErrorLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({ where: { type: "error" }, order: [["timestamp", "DESC"]], limit: 20 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching error logs:", error);
    res.status(500).json({ error: "Failed to fetch error logs" });
  }
};
