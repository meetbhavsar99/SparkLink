const express = require('express');
const {
  createProject,
  getAllProjects,
  filterProject,
  UpdateProjDetails,
  RemoveProject,
  CompleteProject,
  ResumeProject,
  CancelProject,
  DelayProject,
  getUserRoleAccess,
  applyProject,
  removeStakeholder,
  reportProject
} = require('../controllers/projectController');

const {acceptProject, rejectProject}= require('../controllers/projAllocationController');
const authenticateUser = require("../middleware/authenticateUser"); // Import the middleware

const router = express.Router();

router.post("/getUserRoleAccess", authenticateUser, getUserRoleAccess);
router.post("/applyProject", authenticateUser, applyProject);

//Search Filter project with Proj name
router.get("/filter", authenticateUser, filterProject);


// GET route to fetch all projects
router.get("/getAllProjects", authenticateUser, getAllProjects);


// POST route to create a new project
router.post("/", authenticateUser, createProject); // Protect the project creation route


//Update Project Details
router.post("/updateProject", authenticateUser, UpdateProjDetails);

//Delete Project
router.post('/deleteProject', RemoveProject);

//Complete Project
router.post('/completeProject', CompleteProject);

//Resume Project
router.post('/resumeProject', ResumeProject);

//Fail Project
router.post('/cancelProject', CancelProject);

//Delay Project
router.post('/delayProject', DelayProject);

//Remove Project
router.post('/removeStakeholder', removeStakeholder);

router.post('/accept', acceptProject);

router.post('/reject', rejectProject);

//Report Project
router.post('/reportProject', reportProject);

module.exports = router;
