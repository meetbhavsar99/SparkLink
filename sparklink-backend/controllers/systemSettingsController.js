const SystemSettings = require("../models/systemSettings");

// Fetch system settings
exports.getSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.findOne({ where: { id: 1 } }); // Assuming only one row exists for settings
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update system settings
exports.updateSettings = async (req, res) => {
  try {
    const { emailService, emailUser, emailPass, enableNotifications, maintenanceMode } = req.body;

    const updatedSettings = await SystemSettings.update(
      { emailService, emailUser, emailPass, enableNotifications, maintenanceMode },
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
