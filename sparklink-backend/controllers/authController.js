const logsController = require("./logsController");

// Handles user login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      await logsController.createLog(
        null,
        "Login Failed",
        `Invalid email: ${email}`,
        "error"
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await logsController.createLog(
        user.user_id,
        "Login Failed",
        `Incorrect password attempt`,
        "error"
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Successful login
    await logsController.createLog(
      user.user_id,
      "Login Success",
      "User logged in",
      "user"
    );

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    await logsController.createLog(
      null,
      "System Error",
      error.message,
      "error"
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

// Handles project creation and logs the action
exports.createProject = async (req, res) => {
  try {
    const { project_name, user_id } = req.body;
    const newProject = await Project.create(req.body);

    await logsController.createLog(
      user_id,
      "Project Created",
      `Project ${project_name} created successfully`,
      "action"
    );

    res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    await logsController.createLog(
      req.body.user_id,
      "Project Creation Failed",
      error.message,
      "error"
    );
    res
      .status(500)
      .json({ message: "Error creating project", error: error.message });
  }
};

// Handles user profile updates
exports.updateProfile = async (req, res) => {
  try {
    const { user_id, ...updatedData } = req.body;
    const updatedProfile = await User.update(updatedData, {
      where: { user_id },
    });

    if (!updatedProfile) {
      await logsController.createLog(
        "Profile Update",
        user_id,
        "Profile update failed",
        "failed"
      );
      return res.status(400).json({ message: "Update failed" });
    }

    await logsController.createLog(
      "Profile Update",
      user_id,
      "Profile updated successfully"
    );
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    await logsController.createLog(
      "Profile Update",
      user_id,
      "Error updating profile",
      "failed"
    );
    res.status(500).json({ error: "Profile update failed" });
  }
};
