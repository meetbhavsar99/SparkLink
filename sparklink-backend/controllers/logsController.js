const Log = require("../models/logs"); // ✅ Correct
 // Assuming you have a Log model
const { Op } = require("sequelize");
const express = require("express");
const moment = require("moment"); // for date formatting

exports.getLogs = async (req, res) => {
    try {
        const logs = await Log.findAll({
            order: [['created_at', 'DESC']] // Sort logs by latest first
        });

        if (!logs.length) {
            return res.status(404).json({ message: "No logs found." });
        }

        // ✅ Ensure timestamp formatting is correct
        const formattedLogs = logs.map(log => ({
            ...log.toJSON(),
            created_at: log.created_at 
                ? moment(log.created_at).format("YYYY-MM-DD HH:mm:ss") 
                : "Unknown"
        }));

        res.status(200).json(formattedLogs);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: "Server error fetching logs.", error: error.message });
    }
};

// Function to fetch all logs
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

// Function to log user activity
// exports.createLog = async (user_id, action, details, log_type) => {
//     try {
//         await Log.create({
//             user_id,
//             action,
//             details,
//             log_type,
//             created_at: new Date()
//         });
//         console.log(`✅ Log saved: ${action} (${log_type})`);
//     } catch (error) {
//         console.error("❌ Error saving log:", error);
//     }
// };

// Function to log system activity (success and error logs)
exports.createLog = async (user_id = null, action, details, log_type) => {
    try {
        await Log.create({
            user_id,
            action,
            details,
            log_type, // Can be "user", "action", or "error"
            created_at: new Date()
        });
        console.log(`✅ Log saved: ${action} (${log_type})`);
    } catch (error) {
        console.error("❌ Error saving log:", error);
    }
};


// Function to fetch logs based on filters
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

