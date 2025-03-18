const logsController = require("./logsController");

// Log user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      await logsController.createLog("Login Attempt", null, `Failed login for ${email}`, "failed");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Validate password (pseudo code)
    if (!isValidPassword(password, user.password)) {
      await logsController.createLog("Login Attempt", user.user_id, `Failed login attempt for ${email}`, "failed");
      return res.status(401).json({ message: "Incorrect password" });
    }

    await logsController.createLog("Login", user.user_id, `${email} logged in`);
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Log user profile updates
exports.updateProfile = async (req, res) => {
  try {
    const { user_id, ...updatedData } = req.body;
    const updatedProfile = await User.update(updatedData, { where: { user_id } });

    if (!updatedProfile) {
      await logsController.createLog("Profile Update", user_id, "Profile update failed", "failed");
      return res.status(400).json({ message: "Update failed" });
    }

    await logsController.createLog("Profile Update", user_id, "Profile updated successfully");
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    await logsController.createLog("Profile Update", user_id, "Error updating profile", "failed");
    res.status(500).json({ error: "Profile update failed" });
  }
};
