/**
 * Project Routes
 * Handles creation, updates, status changes, applications, and stakeholder management for projects.
 */

const express = require("express");
const {
  createProject,
  getAllProjects,
  filterProject,
  UpdateProjDetails,
  deleteProject,
  CompleteProject,
  ResumeProject,
  CancelProject,
  DelayProject,
  getUserRoleAccess,
  applyProject,
  removeStakeholder,
  reportProject,
} = require("../controllers/projectController");

const {
  acceptProject,
  rejectProject,
} = require("../controllers/projAllocationController");
const projectController = require("../controllers/projectController");

const router = express.Router();

router.post("/getUserRoleAccess", getUserRoleAccess);

router.post("/applyProject", applyProject);

//Search Filter project with Proj name
router.get("/filter", filterProject);

// GET route to fetch all projects
router.get("/getAllProjects", getAllProjects);

// POST route to create a new project
router.post("/", createProject);

//Update Project Details
router.post("/updateProject", UpdateProjDetails);

//Delete Project
router.post("/deleteProject", deleteProject);

//Complete Project
router.post("/completeProject", CompleteProject);

//Resume Project
router.post("/resumeProject", ResumeProject);

//Fail Project
router.post("/cancelProject", CancelProject);

//Delay Project
router.post("/delayProject", DelayProject);

//Remove Project
router.post("/removeStakeholder", removeStakeholder);

router.post("/accept", acceptProject);

router.post("/reject", rejectProject);

//Report Project
router.post("/reportProject", reportProject);

router.get("/getStudentApplications", projectController.getStudentApplications);

router.get("/appliedProjectCount", projectController.getAppliedProjectsCount);

module.exports = router;
