// Controller for managing project status operations (CRUD)
// Includes routes to create, read, update, and delete status values for projects

const ProjectStatus = require("../models/proj_status");

// Retrieve and return all project statuses from the database
const getAllProjectStatuses = async (req, res) => {
  try {
    const projectStatuses = await ProjectStatus.findAll();
    res.json(projectStatuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve project statuses" });
  }
};

// Retrieve a specific project status by its ID
const getProjectStatusById = async (req, res) => {
  try {
    const statusId = req.params.statusId;
    const projectStatus = await ProjectStatus.findByPk(statusId);

    if (!projectStatus) {
      return res.status(404).json({ error: "Project status not found" });
    }

    res.json(projectStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve project status" });
  }
};

// Create a new project status entry in the database
const createProjectStatus = async (req, res) => {
  try {
    const { status_desc } = req.body;
    const projectStatus = await ProjectStatus.create({ status_desc });
    res.status(201).json(projectStatus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create project status" });
  }
};

// Update an existing project status by ID
const updateProjectStatus = async (req, res) => {
  try {
    const statusId = req.params.statusId;
    const projectStatus = await ProjectStatus.findByPk(statusId);

    if (!projectStatus) {
      return res.status(404).json({ error: "Project status not found" });
    }

    await projectStatus.update(req.body);
    res.json({ message: "Project status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update project status" });
  }
};

// Delete a project status by ID from the database
const deleteProjectStatus = async (req, res) => {
  try {
    const statusId = req.params.statusId;
    const projectStatus = await ProjectStatus.findByPk(statusId);

    if (!projectStatus) {
      return res.status(404).json({ error: "Project status not found" });
    }

    await projectStatus.destroy();
    res.json({ message: "Project status deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete project status" });
  }
};

module.exports = {
  getAllProjectStatuses,
  getProjectStatusById,
  createProjectStatus,
  updateProjectStatus,
  deleteProjectStatus,
};
