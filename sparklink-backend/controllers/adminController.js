const { Log } = require("../models"); // Import the Log model

// Fetch the latest 20 logs (all types) for admin overview
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [["timestamp", "DESC"]],
      limit: 20,
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

// Fetch logs specifically related to user activities (e.g., login, registration)
exports.getUserLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      where: { type: "user" },
      order: [["timestamp", "DESC"]],
      limit: 20,
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching user logs:", error);
    res.status(500).json({ error: "Failed to fetch user logs" });
  }
};

// Fetch logs for system or project-related actions (e.g., create/update project)
exports.getActionLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      where: { type: "action" },
      order: [["timestamp", "DESC"]],
      limit: 20,
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching action logs:", error);
    res.status(500).json({ error: "Failed to fetch action logs" });
  }
};

// Fetch logs that represent errors or exceptions (useful for debugging)
exports.getErrorLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      where: { type: "error" },
      order: [["timestamp", "DESC"]],
      limit: 20,
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching error logs:", error);
    res.status(500).json({ error: "Failed to fetch error logs" });
  }
};
