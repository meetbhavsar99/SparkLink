/**
 * Department Routes
 * Provides endpoints to add and retrieve academic or organizational departments.
 */

// routes/departmentRoutes.js
const express = require("express");
const {
  addDepartment,
  getDepartments,
} = require("../controllers/departmentController");
const router = express.Router();

// Route to add a new department
router.post("/departments", addDepartment);

// Route to get all departments
router.get("/departments", getDepartments);

module.exports = router;
