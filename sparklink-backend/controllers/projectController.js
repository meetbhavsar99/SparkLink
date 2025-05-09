const Project = require("../models/project");
const ProjAllocation = require("../models/proj_allocation");
const ProjApplication = require("../models/proj_application");
const Milestone = require("../models/proj_milestone");
const ProjectStatus = require("../models/proj_status");
const Role = require("../models/role");
const User = require("../models/user");
const ProjReport = require("../models/proj_report");
const ValidationUtil = require("../common/validationUtil");
const { Op } = require("sequelize");
const sequelize = require("../config/db");
const SupervisorProfile = require("../models/supervisor_profile");
const logsController = require("../controllers/logsController");
const { skillQueue } = require("../queue/skillextraction");

// Create a new project
exports.createProject = async (req, res) => {
  const t = await sequelize.transaction(); // Start a transaction
  try {
    console.log("Request received");
    console.log(`req.body = ${req.body}`);
    console.log(`req.body.user_id = ${req.body.user_id}`);
    console.log("Category received in request:", req.body.category);

    //console.log(`req.user = ${req.user}`);
    //console.log(`req.req.body.user_id = ${req.req.body.user_id}`);
    //console.log(`req.body.features = ${req.body.features}`);
    const today = new Date().toISOString().split("T")[0];
    // Destructure fields from the request body
    const {
      project_name,
      purpose,
      product,
      project_budget,
      project_description,
      features,
      project_deadline,
      category,
      num_students,
      skills_required,
      image_url,
      supervise,
      userId = req.body.user_id,
    } = req.body;

    // Validate required fields
    if (
      !project_name ||
      !purpose ||
      !product ||
      !project_budget ||
      !project_description ||
      !project_deadline ||
      !category
      // !numStudents ||
      // !skillsRequired
      // !user_id
      // !image_url
    ) {
      return res.status(400).json({
        message:
          "Please provide all required fields: project name, purpose, product, description, budget, and deadline",
      });
    }

    // Validations
    const isValidPurpose =
      !ValidationUtil.isEmptyString(purpose) &&
      !ValidationUtil.isConsecSplChar(purpose) &&
      ValidationUtil.isValidString(purpose, 5, 250);

    const isValidProduct =
      !ValidationUtil.isEmptyString(product) &&
      !ValidationUtil.isConsecSplChar(product) &&
      ValidationUtil.isValidString(product, 5, 250);

    const isValidProjectName =
      !ValidationUtil.isEmptyString(project_name) &&
      !ValidationUtil.isConsecSplChar(project_name) &&
      ValidationUtil.isValidString(project_name, 5, 250);

    const isValidDescription =
      !ValidationUtil.isEmptyString(project_description) &&
      !ValidationUtil.isConsecSplChar(project_description) &&
      ValidationUtil.isValidString(project_description, 5, 250);

    const isValidFeature = (feature) => {
      // Ensure feature is a non-empty string
      if (typeof feature !== "string" || feature.trim() === "") return false;

      // Reject features with consecutive special characters (e.g., "--" or "..")
      const specialCharsRegex = /[\W_]{2,}/; // Matches two or more non-alphanumeric characters
      return !specialCharsRegex.test(feature);
    };

    // Apply validation to features array
    const areValidFeatures = (features) => {
      if (typeof features !== "string" || features.trim() === "") {
        return false; // Invalid if not a string or empty
      }

      // Allow "N/A" explicitly
      if (features === "N/A") {
        return true; // Valid if "N/A"
      }

      const regex = /^[\w\s,.-]+$/; // Allows letters, numbers, spaces, commas, dots, and hyphens
      return regex.test(features); // Returns true if valid
    };

    // In controller
    if (!areValidFeatures(req.body.features)) {
      return res.status(400).json({ message: "Please enter valid Feature(s)" });
    }

    const isValidDate = ValidationUtil.isValidDate(project_deadline);

    if (!isValidDate) {
      return res.status(400).json({ message: "Please select a valid date" });
    } else if (!isValidProjectName) {
      return res.status(400).json({
        message:
          "Please enter a valid Project Name - You may not enter consecutive special characters",
      });
    } else if (!isValidPurpose) {
      return res.status(400).json({
        message:
          "Please enter a valid Purpose - You may not enter consecutive special characters",
      });
    } else if (!isValidProduct) {
      return res.status(400).json({
        message:
          "Please enter valid Product(s) - You may not enter consecutive special characters",
      });
    } else if (!isValidDescription) {
      return res.status(400).json({
        message:
          "Please enter a valid Description - You may not enter consecutive special characters",
      });
    } else if (!areValidFeatures(req.body.features)) {
      return res.status(400).json({
        message:
          "Please enter valid Feature(s) - You may not enter consecutive special characters",
      });
    } else if (project_budget < 0) {
      return res.status(400).json({
        message: "The project budget must be greater than or equal to zero.",
      });
    }

    const user = req.user;
    //const user = req.body;

    // Fallback handling for N/A toggles
    const finalSkills =
      !skills_required || skills_required === "N/A"
        ? "N/A"
        : skills_required.trim();
    const finalFeatures = !features || features === "N/A" ? "N/A" : features;
    const finalNumStudents =
      !num_students || num_students === "N/A" ? 0 : parseInt(num_students);

    const projectData = {
      project_name: project_name,
      purpose: purpose,
      product: product,
      description: project_description,
      features: finalFeatures,
      category: category || "Uncategorized", // Defaults if missing
      num_students: finalNumStudents, // Store NULL if N/A
      skills_required: finalSkills,
      budget: project_budget,
      end_date: project_deadline,
      created_by: req.body.user_id,
      status: 1,
      user_id: req.body.user_id,
      modified_by: req.body.user_id,
      image_url: image_url,
    };

    // Create the project in the database
    const project = await Project.create(projectData, { transaction: t });

    // LOG PROJECT CREATION
    await logsController.createLog(
      req.body.user_id,
      "Project Created",
      `Project '${project_name}' (ID: ${project.proj_id}) was created successfully by user ${req.body.user_id}.`,
      "action"
    );

    // If supervise is true, insert two records with different roles (2 and 3)
    if (supervise) {
      // Insert the record with role 3
      const projAllocationDataRole3 = {
        proj_id: project.proj_id,
        user_id: req.body.user_id,
        role: 3,
        created_by: req.body.user_id,
        modified_by: req.body.user_id,
      };

      await ProjAllocation.create(projAllocationDataRole3, { transaction: t });
    }

    // Insert the record with role 2
    const projAllocationDataRole2 = {
      proj_id: project.proj_id,
      user_id: req.body.user_id,
      role: 2,
      created_by: req.body.user_id,
      modified_by: req.body.user_id,
    };

    // Create the project allocation record in the database with role 2
    const allocation = await ProjAllocation.create(projAllocationDataRole2, {
      transaction: t,
    });

    // Commit the transaction
    await t.commit();

    await skillQueue.add({
      projectId: project.proj_id,
      projectDescription: project_description,
    });
    // Respond with success message and the created project data
    res
      .status(201)
      .json({ message: "Project created successfully", project, allocation });
  } catch (error) {
    // If any error occurs, roll back the transaction
    await t.rollback();

    // LOG ERROR IF PROJECT CREATION FAILS
    await logsController.createLog(
      req.body.user_id,
      "Project Creation Failed",
      `Error: ${error.message} | User ${req.body.user_id} tried to create project '${req.body.project_name}'.`,
      "error"
    );

    // Log error and respond with error message
    console.error(error);
    res
      .status(500)
      .json({ message: "Error creating project", error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    console.log("Fetching all projects...");

    // Ensure user is authenticated before accessing
    if (!req.user || !req.user.user_id) {
      console.error("User data missing in request.");
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    const user = req.user;
    console.log("Authenticated User:", user);

    const projectsQuery = `
      SELECT pr.*, ps.status_desc
      FROM t_project pr, t_proj_status ps
      WHERE pr.is_active = 'Y'
      and pr.status = ps.status_id 
      order by pr.created_on desc
      limit 50;
    `;
    const projects = await sequelize.query(projectsQuery, {
      type: sequelize.QueryTypes.SELECT,
    });

    console.log("Projects fetched successfully.");

    if (projects && projects.length > 0) {
      const projIds = projects.map((project) => project.proj_id);

      const stakeholdersQuery = `
        SELECT pa.proj_id, u.username || ' ' || u.name as name, u.user_id,
        CASE 
          WHEN pa.role = 2 THEN 'business_owner'
          WHEN pa.role = 3 THEN 'supervisor'
          WHEN pa.role = 4 THEN 'student'
        END AS role
        FROM t_proj_allocation pa, t_usermst u 
        WHERE pa.user_id = u.user_id
        and pa.is_active = 'Y'
        and pa.proj_id IN (:projIds)
        order by proj_id desc;
      `;
      const stakeholders = await sequelize.query(stakeholdersQuery, {
        replacements: { projIds },
        type: sequelize.QueryTypes.SELECT,
      });

      const stakeholderMap = stakeholders.reduce((map, stakeholder) => {
        if (!map[stakeholder.proj_id]) {
          map[stakeholder.proj_id] = [];
        }
        map[stakeholder.proj_id].push({
          name: stakeholder.name,
          role: stakeholder.role,
          user_id: stakeholder.user_id,
          proj_id: stakeholder.proj_id,
        });
        return map;
      }, {});

      const milestonesQuery = `
        SELECT proj_id, 
          COUNT(CASE WHEN is_active = 'Y' THEN 1 END) AS active_milestones,
          COUNT(CASE WHEN is_active = 'Y' AND is_completed = 'Y' THEN 1 END) AS completed_milestones
        FROM t_proj_milestone
        WHERE proj_id IN (:projIds)
        GROUP BY proj_id;
      `;
      const milestones = await sequelize.query(milestonesQuery, {
        replacements: { projIds },
        type: sequelize.QueryTypes.SELECT,
      });

      // Map milestones by project
      const milestoneMap = milestones.reduce((map, milestone) => {
        const progress =
          milestone.active_milestones > 0
            ? Math.round(
                (milestone.completed_milestones / milestone.active_milestones) *
                  100
              )
            : 0;
        map[milestone.proj_id] = progress || 0;
        return map;
      }, {});

      // Combine all data into the projects array
      projects.forEach((project) => {
        project.status_desc = project.status_desc || "";
        project.stakeholder = stakeholderMap[project.proj_id] || [];
        project.progress = milestoneMap[project.proj_id] || 0;
      });
    }

    res.status(200).json({
      projects,
      user: {
        user_id: req.body.user_id,
        username: user.username | "Unknown", // Prevents undefined error
        email: user.email,
        role: user.role,
        isAuthenticated: true,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching projects",
      error: error.message,
    });
  }
};

// Get a single project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { proj_id: req.params.id },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching project", error: error.message });
  }
};

// Update a project by ID
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { proj_id: req.params.id },
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    console.log("updateProjectData>>>>>", req.body);
    await project.update(req.body);

    await logsController.createLog(
      req.body.user_id,
      "Project Updated",
      `Project ID ${req.params.id} was updated by user ${req.body.user_id}.`,
      "action"
    );

    res.status(200).json(project);
  } catch (error) {
    await logsController.createLog(
      req.body.user_id,
      "Project Update Failed.",
      `Error: ${error.message} | User '${
        req.body.user_id || "Unknown"
      } attempted to update the profile '${req.params.id || "Unknown"}'.`,
      "error"
    );

    res
      .status(500)
      .json({ message: "Error updating project", error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  const { projData } = req.body;
  const projectId = projData.proj_id;
  const userId = req.body.user_id;

  const transaction = await sequelize.transaction(); // Begin transaction

  try {
    // Step 1: Clean up all related tables
    await sequelize.query(
      `DELETE FROM t_milestone_counter WHERE proj_id = :projectId`,
      { replacements: { projectId }, transaction }
    );
    await sequelize.query(
      `DELETE FROM t_proj_allocation WHERE proj_id = :projectId`,
      { replacements: { projectId }, transaction }
    );
    await sequelize.query(
      `DELETE FROM t_proj_application WHERE proj_id = :projectId`,
      { replacements: { projectId }, transaction }
    );
    await sequelize.query(
      `DELETE FROM t_proj_milestone WHERE proj_id = :projectId`,
      { replacements: { projectId }, transaction }
    );
    await sequelize.query(
      `DELETE FROM t_proj_report WHERE proj_id = :projectId`,
      { replacements: { projectId }, transaction }
    );

    // Step 2: Finally delete from the main project table
    await sequelize.query(`DELETE FROM t_project WHERE proj_id = :projectId`, {
      replacements: { projectId },
      transaction,
    });

    await transaction.commit(); // Commit changes

    // Log success
    const currentUser = req.user || {};
    const userId = currentUser.user_id || "System";
    const username = currentUser.username || "Unknown";
    const name = currentUser.name || "";

    await logsController.createLog(
      userId,
      "Project Deleted",
      `Project ID ${projectId} was deleted by user (${userId}) ${username} ${name}`,
      "action"
    );

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    await transaction.rollback(); // Rollback on error

    await logsController.createLog(
      userId || "System",
      "Project Deletion Failed",
      `Error: ${error.message} | User ${
        userId || "Unknown"
      } attempted to delete project ID ${projectId}.`,
      "error"
    );

    res
      .status(500)
      .json({ message: "Error deleting project", error: error.message });
  }
};

exports.filterProject = async (req, res) => {
  try {
    const { projName } = req.query;

    if (projName && typeof projName !== "string") {
      return res.status(400).json({ message: "Invalid projName parameter" });
    }

    const filter = {
      is_active: "Y",
    };

    if (projName) {
      filter.project_name = {
        [Op.iLike]: `%${projName}%`, // Use iLike for case-insensitive search
      };
    } // If projName is not provided, no filter is applied

    // Fetch projects using the filter
    const projects = await Project.findAll({
      where: filter,
    });

    res.status(200).json(projects);
  } catch (error) {
    console.error("Error filtering projects:", error);
    res
      .status(500)
      .json({ message: "Error filtering projects", error: error.message });
  }
};

exports.UpdateProjDetails = async (req, res) => {
  try {
    const { projDetailsList } = req.body;

    const isValidDate = ValidationUtil.isValidDate(projDetailsList.end_date);
    const isValidPurpose =
      !ValidationUtil.isEmptyString(projDetailsList.purpose) &&
      !ValidationUtil.isConsecSplChar(projDetailsList.purpose) &&
      ValidationUtil.isValidString(projDetailsList.purpose, 5, 250);
    //const isProductEmpty = ValidationUtil.isEmptyString(projDetailsList.product);
    const isValidProduct =
      !ValidationUtil.isEmptyString(projDetailsList.product) &&
      !ValidationUtil.isConsecSplChar(projDetailsList.product) &&
      ValidationUtil.isValidString(projDetailsList.product, 5, 250);
    //const isDescriptionEmpty = ValidationUtil.isEmptyString(projDetailsList.description);
    const isValidDescription =
      !ValidationUtil.isEmptyString(projDetailsList.description) &&
      !ValidationUtil.isConsecSplChar(projDetailsList.description) &&
      ValidationUtil.isValidString(projDetailsList.description, 5, 250);
    //const isFeaturesEmpty = ValidationUtil.isEmptyString(projDetailsList.features);
    const isValidFeatures =
      !ValidationUtil.isEmptyString(projDetailsList.features) &&
      !ValidationUtil.isConsecSplChar(projDetailsList.features) &&
      ValidationUtil.isValidString(projDetailsList.features, 5, 250);

    const isValidSkills =
      !ValidationUtil.isEmptyString(projDetailsList.skills_req) &&
      !ValidationUtil.isConsecSplChar(projDetailsList.skills_req) &&
      ValidationUtil.isValidString(projDetailsList.skills_req, 5, 250);

    if (!isValidDate) {
      return res.status(400).json({ message: "Please select a valid date" });
    } else if (!isValidPurpose) {
      return res.status(400).json({
        message:
          "Please enter a valid Purpose - You may not enter consecutive special characters",
      });
    } else if (!isValidProduct) {
      return res.status(400).json({
        message:
          "Please enter valid Product(s) - You may not enter consecutive special characters",
      });
    } else if (!isValidDescription) {
      return res.status(400).json({
        message:
          "Please enter a valid Description - You may not enter consecutive special characters",
      });
    } else if (!isValidFeatures) {
      return res.status(400).json({
        message:
          "Please enter valid Feature(s) - You may not enter consecutive special characters",
      });
    } else if (!isValidSkills) {
      return res.status(400).json({
        message:
          "Please enter valid Skill(s) - You may not enter consecutive special characters",
      });
    } else if (projDetailsList.budget < 0) {
      return res.status(400).json({
        message: "The project budget must be greater than or equal to zero.",
      });
    }

    const updatedData = await Project.update(
      {
        purpose: projDetailsList.purpose.trim(),
        product: projDetailsList.product.trim(),
        description: projDetailsList.description.trim(),
        features: projDetailsList.features.trim(),
        skills_req: projDetailsList.skills_req,
        budget: projDetailsList.budget,
        status: projDetailsList.status,
        end_date: projDetailsList.end_date,
      },
      {
        where: { proj_id: projDetailsList.proj_id },
      }
    );

    res
      .status(200)
      .json({ message: "Project Details updated successfully", updatedData });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating Project Details",
      error: error.message,
    });
  }
};

// Get all applications for a student
exports.getStudentApplications = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    console.log(`Fetching applications for user: ${user_id}`);

    const applications = await ProjApplication.findAll({
      where: { user_id },
      include: [
        {
          model: Project,
          as: "project",
          attributes: ["project_name", "description", "purpose", "product"],
        },
      ],
      order: [["created_on", "DESC"]],
    });

    if (!applications.length) {
      return res.status(200).json([]); // No applications found
    }

    const formattedApplications = applications.map((app) => ({
      project_name: app.project?.project_name || "Unknown",
      description: app.project?.description || "No description available",
      purpose: app.project?.purpose || "N/A",
      product: app.project?.product || "N/A",
      applied_on: app.created_on,
      status:
        app.is_approved === "Y"
          ? "Accepted"
          : app.is_rejected === "Y"
          ? "Rejected"
          : "Pending",
    }));

    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error("Error fetching student applications:", error);
    res
      .status(500)
      .json({ message: "Error fetching applications", error: error.message });
  }
};

exports.RemoveProject = async (req, res) => {
  try {
    const { projData } = req.body;

    const deletedData = await Project.update(
      {
        is_active: "N",
      },
      {
        where: { proj_id: projData.proj_id },
      }
    );

    res
      .status(200)
      .json({ message: "Project Deleted successfully", deletedData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting Project", error: error.message });
  }
};

exports.CompleteProject = async (req, res) => {
  try {
    const { projData } = req.body;

    const updatedData = await Project.update(
      {
        status: 5,
      },
      {
        where: { proj_id: projData.proj_id },
      }
    );

    res.status(200).json({
      message: "Project Marked as Complete successfully",
      updatedData,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error Completing Project", error: error.message });
  }
};

exports.ResumeProject = async (req, res) => {
  try {
    const { projData } = req.body;

    const updatedData = await Project.update(
      {
        status: 4,
      },
      {
        where: { proj_id: projData.proj_id },
      }
    );

    res
      .status(200)
      .json({ message: "Project Resumed successfully", updatedData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error Resuming Project", error: error.message });
  }
};

exports.CancelProject = async (req, res) => {
  try {
    const { projData } = req.body;

    const updatedData = await Project.update(
      {
        status: 7,
      },
      {
        where: { proj_id: projData.proj_id },
      }
    );

    res
      .status(200)
      .json({ message: "Project Cancelled successfully", updatedData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error Cancelling Project", error: error.message });
  }
};

exports.DelayProject = async (req, res) => {
  try {
    const { projData } = req.body;

    const updatedData = await Project.update(
      {
        status: 6,
      },
      {
        where: { proj_id: projData.proj_id },
      }
    );

    res
      .status(200)
      .json({ message: "Project Delayed successfully", updatedData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error Delaying Project", error: error.message });
  }
};

exports.applyProject = async (req, res) => {
  try {
    console.log("Processing project application...");
    console.log("Received request body:", req.body);

    // const { proj_id, user_id } = req.body;
    const { proj_id, user_id, priority } = req.body;

    if (!proj_id || !user_id) {
      console.error("Missing proj_id or user_id");
      return res
        .status(400)
        .json({ message: "Project ID and User ID are required" });
    }

    if (!priority || priority < 1 || priority > 10) {
      return res
        .status(400)
        .json({ message: "Priority must be between 1 and 10" });
    }

    const user = await User.findOne({ where: { user_id } });

    if (!user) {
      console.error("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    const role = Number(user.role);
    console.log("User Role:", role);

    if (role !== 4) {
      return res
        .status(403)
        .json({ message: "Only students can apply for projects" });
    }

    // Prevent applying if 7 or more applications already exist
    const totalApplications = await ProjApplication.count({
      where: { user_id, is_active: "Y" },
    });

    console.log(
      `Total active applications for user ${user_id}: ${totalApplications}`
    );

    if (totalApplications >= 10) {
      return res.status(400).json({
        success: false,
        message: "You have already applied to 10 projects.",
      });
    }

    const studentApplList = {
      proj_id: proj_id,
      user_id: user_id,
      role: role,
      created_by: user_id,
      modified_by: user_id,
      is_active: "Y",
      priority: priority || null,
    };

    console.log("Creating project application entry:", studentApplList);

    const student = await ProjApplication.create(studentApplList);

    await logsController.createLog(
      user_id,
      "Project Application",
      `Student ${user_id} applied for Project ID ${proj_id}`,
      "action"
    );

    console.log("Project application created successfully");
    return res.status(200).json({
      success: true,
      message: "Project application successful",
      student,
    });
  } catch (error) {
    console.error("Error applying for project:", error);
    await logsController.createLog(
      req.body.user_id,
      "Project Application Failed",
      error.message,
      "error"
    );
    return res.status(500).json({
      message: "Error creating project application",
      error: error.message,
    });
  }
};

exports.getAppliedProjectsCount = async (req, res) => {
  try {
    const user_id = req.query.user_id || req.body.user_id || req.user?.user_id;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const count = await ProjApplication.count({
      where: {
        user_id,
        is_active: "Y",
      },
    });

    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching application count:", error);
    return res.status(500).json({
      message: "Error fetching applied project count",
      error: error.message,
    });
  }
};

/**
 * access_val === 'S' -> User has admin access can take every action on the Project
 * access_val === 'SB' -> User is the Business Owner and a Supersor of the project and has edit and delete access to the Project
 * access_val === 'SBA' -> User is the Business Owner and a Supersor of the project and has Apply access to the Project
 * access_val === 'E' -> User has supervisor role and edit access on the Project
 * access_val === 'A' -> User has access to Apply to the Project
 * access_val === 'B' -> User has access to Edit and Delete access to the Project
 * access_val === 'M' -> User has access to View the Milestones of the Project
 * access_val === 'I' -> User has no access to any action on the Project
 */

exports.getUserRoleAccess = async (req, res) => {
  try {
    // const { proj_id } = req.body;

    // const user = req.user;
    // const user_id = req.body.user_id;
    // const role = Number(user.role);

    // let supervisor_count = 0;

    // const projStatus = await Project.findOne({
    //   where: {
    //     proj_id: proj_id
    //   },
    //   attributes: ['proj_id', 'status']
    // });
    const { proj_id, user_id } = req.body;

    if (!proj_id || !user_id) {
      return res
        .status(400)
        .json({ message: "Project ID and User ID are required" });
    }

    const user = await User.findOne({ where: { user_id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const projStatus = await Project.findOne({
      where: { proj_id },
      attributes: ["proj_id", "status"],
    });

    if (!projStatus) {
      return res.status(404).json({ message: "Project not found" });
    }

    const role = Number(user.role);
    let supervisor_count = 0;

    if (role === 3) {
      //Managing Supervisor Access
      supervisor_count = await ProjAllocation.count({
        where: {
          proj_id: proj_id,
          role: role,
          is_active: "Y",
        },
      });

      const supervisor_exists = await ProjAllocation.count({
        where: {
          proj_id: proj_id,
          user_id: user_id,
          role: role,
          is_active: "Y",
        },
      });

      const supervisor_business_owner = await ProjAllocation.count({
        where: {
          proj_id: proj_id,
          user_id: user_id,
          role: 2,
          is_active: "Y",
        },
      });

      if (supervisor_business_owner === 1 && supervisor_exists !== 1) {
        return res
          .status(200)
          .json({ success: true, message: "Valid User", access_val: "SBA" });
      } else if (supervisor_business_owner === 1 && supervisor_exists === 1) {
        return res
          .status(200)
          .json({ success: true, message: "Valid User", access_val: "SB" });
      }

      //Supervisor Edit
      if (supervisor_exists === 1) {
        return res
          .status(200)
          .json({ success: true, message: "Valid User", access_val: "E" });
      } else {
        //Supervisor Apply
        if (supervisor_count < 2) {
          if (projStatus.status !== 5 || projStatus.status !== 7) {
            return res
              .status(200)
              .json({ success: true, message: "Valid User", access_val: "A" });
          } else {
            return res
              .status(200)
              .json({ success: true, message: "Valid User", access_val: "I" });
          }
        } else {
          return res
            .status(200)
            .json({ succes: false, message: "Invalid User", access_val: "I" });
        }
      }
    } else if (role === 2) {
      //Managing Business Owner Access
      const business_owner = await ProjAllocation.count({
        where: {
          proj_id: proj_id,
          user_id: user_id,
          role: role,
          is_active: "Y",
        },
      });

      if (business_owner === 1) {
        return res
          .status(200)
          .json({ success: true, message: "Valid User", access_val: "B" });
      } else {
        return res
          .status(200)
          .json({ success: false, message: "Invalid User", access_val: "I" });
      }
    } else if (role === 4) {
      //Managing Student Access
      const isStudent = await ProjAllocation.count({
        where: {
          proj_id: proj_id,
          user_id: user_id,
          role: role,
          is_active: "Y",
        },
      });

      if (isStudent === 1) {
        return res
          .status(200)
          .json({ success: true, message: "Valid User", access_val: "M" });
      }

      const student_appl = await ProjApplication.count({
        where: {
          proj_id: proj_id,
          user_id: user_id,
          role: role,
          is_active: "Y",
          is_approved: "N",
          is_rejected: "N",
        },
      });

      if (student_appl === 1) {
        return res
          .status(200)
          .json({ success: false, message: "Invalid User", access_val: "I" });
      }

      if (isStudent === 0) {
        if (
          projStatus.status === 1 ||
          projStatus.status === 2 ||
          projStatus.status === 3 ||
          projStatus.status === 4
        ) {
          return res
            .status(200)
            .json({ success: true, message: "Valid User", access_val: "A" });
        } else {
          return res
            .status(200)
            .json({ success: false, message: "Invalid User", access_val: "I" });
        }
      } else if (student === 1) {
        if (
          projStatus.status === 4 ||
          projStatus.status === 5 ||
          projStatus.status === 6 ||
          projStatus.status === 7
        ) {
          return res
            .status(200)
            .json({ success: true, message: "Valid User", access_val: "M" });
        } else {
          return res
            .status(200)
            .json({ success: false, message: "Invalid User", access_val: "I" });
        }
      }
    } else if (role === 1) {
      //Managing Admin Access
      return res
        .status(200)
        .json({ success: true, message: "Valid User", access_val: "S" });
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Invalid User", access_val: "I" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error verifying User Access", error: error.message });
  }
};

exports.removeStakeholder = async (req, res) => {
  const { removeData } = req.body;
  let role_id;

  if (removeData.role === "business_owner") {
    role_id = 2;
  } else if (removeData.role === "supervisor") {
    role_id = 3;
  } else if (removeData.role === "student") {
    role_id = 4;
  }

  try {
    const applicationUpdate = await ProjApplication.update(
      {
        is_active: "N",
      },
      {
        where: {
          proj_id: removeData.proj_id,
          role: role_id,
          user_id: removeData.user_id,
        },
      }
    );

    const allocationUpdate = await ProjAllocation.update(
      {
        is_active: "N",
      },
      {
        where: {
          proj_id: removeData.proj_id,
          role: role_id,
          user_id: removeData.user_id,
        },
      }
    );

    const supervisor_count = await ProjAllocation.count({
      where: {
        proj_id: removeData.proj_id,
        role: 3,
        is_active: "Y",
      },
    });

    const student_count = await ProjAllocation.count({
      where: {
        proj_id: removeData.proj_id,
        role: 4,
        is_active: "Y",
      },
    });

    if (role_id === 3) {
      if (supervisor_count === 0) {
        const status_update = await Project.update(
          {
            status: 1,
            modified_by: req.req.body.user_id,
          },
          {
            where: {
              proj_id: removeData.proj_id,
            },
          }
        );
      }
    } else if (role_id === 4) {
      if (student_count === 0 && supervisor_count > 0) {
        const status_update = await Project.update(
          {
            status: 2,
            modified_by: req.req.body.user_id,
          },
          {
            where: {
              proj_id: removeData.proj_id,
            },
          }
        );
      } else if (student_count === 0 && supervisor_count === 0) {
        const status_update = await Project.update(
          {
            status: 1,
            modified_by: req.req.body.user_id,
          },
          {
            where: {
              proj_id: removeData.proj_id,
            },
          }
        );
      }
    }

    return res
      .status(200)
      .json({ message: "Stakeholder removed successfully from the project" });
  } catch (error) {
    return res.status(500).json({
      message: "Error removing stakeholder from the project",
      error: error.message,
    });
  }
};

exports.reportProject = async (req, res) => {
  try {
    const { reportData } = req.body;
    const proj_id = reportData.proj_id;
    const reason = reportData.reason;

    const user = req.user;

    const isValidReason =
      !ValidationUtil.isEmptyString(reason) &&
      !ValidationUtil.isConsecSplChar(reason) &&
      ValidationUtil.isValidString(reason, 5, 250);

    if (!isValidReason) {
      return res.status(400).json({ message: "Please enter a valid reason" });
    }

    const reportExists = await ProjReport.count({
      where: {
        proj_id: proj_id,
      },
    });

    const report = await ProjReport.create({
      proj_id: proj_id,
      reported_by: req.body.user_id,
      reason: reason,
      report_count: reportExists + 1,
    });

    return res
      .status(200)
      .json({ message: "Project has been reported succesfully", report });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error Reporting Project", error: error.message });
  }
};
