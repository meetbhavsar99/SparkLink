const project_allocation = require("../models/proj_allocation");
const project_application = require("../models/proj_application");
const Project = require("../models/project");
const logsController = require("../controllers/logsController"); // Import logs controller

const acceptProject = async (req, res) => {
  try {
    const user = req.user;
    const { proj_id, user_id } = req.body;
    const role = 4;

    // Define the new allocation object
    const allocationList = {
      proj_id: proj_id,
      user_id: user_id,
      role: role,
      created_by: user_id,
      modified_by: user_id,
      is_active: 'Y'
    };

    const student_exists = await project_allocation.count({
      where: {
        proj_id: proj_id,
        role: role,
        is_active: 'Y'
      }
    });

    // Insert a new record into the project_allocation table
    await project_allocation.create(allocationList);

    // Update the application status in the project_application table
    await project_application.update(
      {
        is_active: 'Y', // Change the status to inactive
        is_approved: 'Y', // Mark as approved
        is_rejected: 'N'
      },
      {
        where: {
          proj_id: proj_id,
          user_id: user_id,
          role: role,
          is_active: 'Y'
        },
      }
    );

    if(student_exists === 0) {
      const statusUpdate = await Project.update({
        status: 3,
        modified_by: user_id
      }, {
        where: {
          proj_id: proj_id
        }
      });
    }

    // ✅ LOG SUCCESSFUL APPROVAL
        await logsController.createLog(
          user.user_id, 
          "Student Accepted",
          `Supervisor ${user.user_id} accepted student ${user_id} for Project ID ${proj_id}`,
          "action"
        );
    
    // Respond with success
    res.status(200).json({
      message: "Project application accepted.",
    });
  } catch (error) {
    console.error("Error accepting project:", error);
    // ❌ LOG ERROR IF ACCEPTANCE FAILS
        await logsController.createLog(
          req.user?.user_id || "System",
          "Application Acceptance Failed",
          `Error: ${error.message} | Supervisor ${req.user?.user_id} failed to accept student ${req.body.user_id} for Project ID ${req.body.proj_id}.`,
          "error"
        );

    res.status(500).json({ error: "Failed to accept project application." });
  }
};

const rejectProject = async (req, res) => {
  const { proj_id, user_id } = req.body;
  const role = 4;

  try {
    // Check if the project application exists
    const existingApplication = await project_application.findOne({
      where: {
        proj_id,
        user_id,
        role,
      },
    });

    if (!existingApplication) {
      return res.status(404).json({
        message: "No matching project application found",
      });
    }

    // Update the record to mark it as inactive and rejected
    await project_application.update(
      {
        is_active: 'Y',
        is_rejected: 'Y',
        is_approved: 'N',
      },
      {
        where: {
          proj_id,
          user_id,
          role,
        },
      }
    );

    // ✅ LOG SUCCESSFUL REJECTION
        await logsController.createLog(
          req.user?.user_id, 
          "Student Rejected",
          `Supervisor ${req.user?.user_id} rejected student ${user_id} for Project ID ${proj_id}`,
          "action"
        );

    res.status(200).json({
      message: "Project application rejected successfully",
    });
  } catch (error) {
    console.error("Error rejecting project:", error);
    // ❌ LOG ERROR IF REJECTION FAILS
        await logsController.createLog(
          req.user?.user_id || "System",
          "Application Rejection Failed",
          `Error: ${error.message} | Supervisor ${req.user?.user_id} failed to reject student ${req.body.user_id} for Project ID ${req.body.proj_id}.`,
          "error"
        );
    
        
    res.status(500).json({ error: "Failed to reject project application" });
  }
};

module.exports = {
  acceptProject,
  rejectProject,
};
