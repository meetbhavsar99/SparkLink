// Controller for managing global system settings like email config, notifications, and maintenance mode
const SystemSettings = require("../models/systemSettings");

// Fetch current system settings (only one record expected)
exports.getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne({ where: { id: 1 } });
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update the system settings such as email credentials, notification toggle, and maintenance mode
exports.updateSettings = async (req, res) => {
  try {
    const {
      emailService,
      emailUser,
      emailPass,
      enableNotifications,
      maintenanceMode,
    } = req.body;

    const updatedSettings = await SystemSettings.update(
      {
        emailService,
        emailUser,
        emailPass,
        enableNotifications,
        maintenanceMode,
      },
      { where: { id: 1 } }
    );

    if (!updatedSettings) {
      return res.status(400).json({ message: "Failed to update settings" });
    }

    res.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
