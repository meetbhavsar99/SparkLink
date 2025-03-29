const db = require("../models");
const sequelize = require("../config/db");

// Fetches the latest 50 logs of all types
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await db.Log.findAll({
      order: [["timestamp", "DESC"]],
      limit: 50,
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

// Fetches logs filtered by a specific type (users, actions, or errors)
exports.getLogsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ["users", "actions", "errors"];

    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid log type" });
    }

    const logs = await db.Log.findAll({
      where: { type },
      order: [["timestamp", "DESC"]],
      limit: 50,
    });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs by type:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};
