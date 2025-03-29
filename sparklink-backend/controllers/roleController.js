// Controller for managing user roles (e.g., admin, student, supervisor)
// Includes functionality to create and retrieve role records
const Role = require("../models/role");

// Add a new role to the system with metadata like created_by and is_active
exports.addRole = async (req, res) => {
  const { role_desc, is_active, created_by } = req.body;

  try {
    // Create a new role in the database
    const newRole = await Role.create({
      role_desc,
      is_active,
      created_by,
      modified_by: created_by,
    });
    res.status(201).json({
      message: "Role created successfully",
      role: newRole,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({
      message: "Error creating role",
      error: error.message,
    });
  }
};

// Fetch and return all available roles from the database
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({
      message: "Error fetching roles",
      error: error.message,
    });
  }
};
