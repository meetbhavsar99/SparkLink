const Log = require("../models/logs");
const { Op } = require("sequelize");
const express = require("express");
const moment = require("moment"); // for date formatting
const { Parser } = require("json2csv");

// Fetch all logs with formatted timestamps
exports.getLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [["created_at", "DESC"]], // Sort logs by latest first
    });

    if (!logs.length) {
      return res.status(404).json({ message: "No logs found." });
    }

    // Ensure timestamp formatting is correct
    const formattedLogs = logs.map((log) => ({
      ...log.toJSON(),
      created_at: log.created_at
        ? moment(log.created_at).format("YYYY-MM-DD HH:mm:ss")
        : "Unknown",
    }));

    res.status(200).json(formattedLogs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res
      .status(500)
      .json({ message: "Server error fetching logs.", error: error.message });
  }
};

// Fetch all logs without filters (raw version)
exports.getAllLogs = async (req, res) => {
  try {
    const logs = await Log.findAll({
      order: [["timestamp", "DESC"]],
    });
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Failed to retrieve logs." });
  }
};

// Create a new log entry
exports.createLog = async (user_id = null, action, details, log_type) => {
  try {
    await Log.create({
      user_id,
      action,
      details,
      log_type, // Can be "user", "action", or "error"
      created_at: new Date(),
    });
    console.log(`Log saved: ${action} (${log_type})`);
  } catch (error) {
    console.error("Error saving log:", error);
  }
};

// Fetch logs based on optional filters: action, user, type, date
exports.getFilteredLogs = async (req, res) => {
  try {
    const { action, user_id, log_type, date } = req.query;
    let whereCondition = {};

    //if (action) whereCondition.action = action;
    if (action) whereCondition.action = { [Op.like]: `%${action}%` }; // Case-insensitive search
    if (user_id) whereCondition.user_id = user_id;
    if (log_type) whereCondition.log_type = log_type;

    if (date) {
      whereCondition.created_at = {
        [Op.between]: [
          new Date(date + " 00:00:00"),
          new Date(date + " 23:59:59"),
        ],
      };
    }

    const logs = await Log.findAll({
      where: whereCondition,
      order: [["created_at", "DESC"]],
    });

    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching filtered logs:", error);
    res.status(500).json({ error: "Failed to retrieve logs." });
  }
};

// Download filtered logs as a CSV file
exports.downloadLogs = async (req, res) => {
  try {
    const { log_type, user_id, date, action } = req.query;

    const filters = {};
    if (log_type) filters.log_type = log_type;
    if (user_id) filters.user_id = user_id;
    if (date) filters.created_at = { [Op.startsWith]: date };
    if (action) filters.action = { [Op.iLike]: `%${action}%` };

    const logs = await Log.findAll({
      where: filters,
      order: [["created_at", "DESC"]],
    });

    // Format the logs BEFORE converting to CSV
    const formattedLogs = logs.map((log) => ({
      created_at: log.created_at
        ? moment(log.created_at).format("DD-MMM-YYYY hh:mm A")
        : "Unknown",
      user_id: log.user_id || "System",
      action: log.action,
      details: log.details,
      log_type: log.log_type,
    }));

    const fields = ["created_at", "user_id", "action", "details", "log_type"];
    const parser = new Parser({ fields });
    const csv = parser.parse(formattedLogs);

    res.header("Content-Type", "text/csv");
    res.attachment("filtered_logs.csv");
    res.send(csv);
  } catch (error) {
    console.error("Error generating log CSV:", error);
    res
      .status(500)
      .json({ message: "Error downloading logs", error: error.message });
  }
};
