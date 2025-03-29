// Controller for creating a new project application and notifying the project creator

const ProjApplication = require("../models/proj_application");

const User = require("../models/user");
const Project = require("../models/project");

// Save application details to the database
exports.createApplication = async (req, res) => {
  try {
    const { projectList } = req.body;

    // Save the project application
    const projData = await ProjApplication.create(projectList);

    // Fetch project to get creator
    const project = await Project.findOne({
      where: { proj_id: projectList.proj_id },
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Send in-app notification to project creator (supervisor OR admin)
    await Notification.create({
      proj_id: projectList.proj_id,
      user_id: projectList.user_id, // student who applied
      recipient_id: project.created_by, // notify the creator
      code: "SA", // Student Applied
      created_on: new Date(),
      is_read: "N",
    });

    return res.status(201).json({
      message: "Project Application saved and notification sent",
      projData,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error saving project application",
      error: error.message,
    });
  }
};
