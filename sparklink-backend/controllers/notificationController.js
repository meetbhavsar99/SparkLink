// Controller for managing notifications, including fetching, counting, and updating them based on user roles
const nodemailer = require("nodemailer");
const ProjApplication = require("../models/proj_application");
const ProjAllocation = require("../models/proj_allocation");
const User = require("../models/user");
const Project = require("../models/project");

// Fetch notifications specific to the logged-in user's role
exports.fetchNotifications = async (req, res) => {
  console.log("entered fetch applciation");
  try {
    const user = req.user;

    let notifications = [];
    console.log(" role---> ", user.role);
    if (user.role === "2") {
      // Business Owner
      console.log("entered if condition");
      console.log("Associations ---> ", ProjAllocation.associations);
      console.log("Associations ---> ", ProjApplication.associations);
      const allocations = await Project.findAll({
        where: {
          user_id: user.user_id,
          is_active: "Y",
        },
        attributes: ["proj_id"], // Get only the proj_id
      }).then(async (projects) => {
        // Extract proj_ids from the fetched projects
        const projIds = projects.map((project) => project.proj_id);

        // Now, search in the ProjAllocation table for matching proj_ids
        const allocations = await ProjAllocation.findAll({
          where: {
            proj_id: projIds,
            b_notification: "Y",
            is_active: "Y",
          },
          include: [
            {
              model: User,
              attributes: ["user_id", "username"],
              as: "user",
            },
            {
              model: Project,
              attributes: ["proj_id", "project_name"],
              as: "project",
            },
          ],
        });
        return allocations;
      });

      // console.log('allocations --- > ', allocations);

      allocations.forEach((allocation) => {
        const { proj_id, role, created_on } = allocation;
        const project_name = allocation.project.project_name;
        const user_id = allocation.user.user_id;
        const user_name = allocation.user.username;

        console.log("role ---> ", role);

        if (role === 2) {
          console.log("entered  role ==2 ");
          notifications.push({
            code: "BP",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        }

        if (role === 3) {
          notifications.push({
            code: "BS",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        }

        if (role === 4) {
          notifications.push({
            code: "BT",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        }
      });
    } else if (user.role === "3") {
      const allocation_projIds = await ProjAllocation.findAll({
        where: {
          user_id: user.user_id,
          is_active: "Y",
        },
        attributes: ["proj_id"], // Get proj_id's
      });

      const projIds = allocation_projIds.map(
        (allocation) => allocation.proj_id
      );

      allocations = await ProjAllocation.findAll({
        where: {
          proj_id: projIds,
          s_notification: "Y",
          is_active: "Y",
        },
        include: [
          {
            model: User,
            attributes: ["user_id", "username"],
            as: "user",
          },
          {
            model: Project,
            attributes: ["proj_id", "project_name"],
            as: "project",
          },
        ],
      });

      allocations.forEach((allocation) => {
        const { proj_id, role, created_on } = allocation;
        const project_name = allocation.project.project_name;
        const user_id = allocation.user.user_id;
        const user_name = allocation.user.username;

        if (role === 2 && user_id === user.user_id) {
          // Insert SP notification for role 2 (Business)
          notifications.push({
            code: "SP",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        } else if (role === 3 && user_id === user.user_id) {
          // Insert SV notification for role 3 (Supervisor)
          notifications.push({
            code: "SV",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        } else if (role === 3 && user_id !== user.user_id) {
          // Insert SS notification for role 3 (Supervisor different user)
          notifications.push({
            code: "SS",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        } else if (role === 4) {
          // Insert ST notification for role 4 (Student)
          notifications.push({
            code: "ST",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        }
      });

      const applications = await ProjApplication.findAll({
        where: {
          proj_id: projIds,
          is_active: "Y",
          is_approved: "N",
          is_rejected: "N",
        },
        include: [
          {
            model: User,
            attributes: ["user_id", "username"],
            as: "user",
          },
          {
            model: Project,
            attributes: ["proj_id", "project_name"],
            as: "project",
          },
        ],
      });

      applications.forEach((application) => {
        const { proj_id, role, created_on } = application;
        const project_name = application.project.project_name;
        const user_id = application.user.user_id;
        const user_name = application.user.username;
        notifications.push({
          code: "SA",
          user_id,
          user_name,
          proj_id,
          proj_name: project_name,
          created_on,
        });
      });
    } else if (user.role === "4") {
      const allocations = await ProjAllocation.findAll({
        where: {
          user_id: user.user_id,
          notification: "Y",
        },
        include: [
          {
            model: User,
            attributes: ["user_id", "username"],
            as: "user",
          },
          {
            model: Project,
            attributes: ["proj_id", "project_name"],
            as: "project",
          },
        ],
      });
      allocations.forEach((allocation) => {
        const { proj_id, role, created_on, is_active } = allocation;
        const project_name = allocation.project.project_name;
        const user_id = allocation.user.user_id;
        const user_name = allocation.user.username;

        if (role === 4 && is_active === "Y") {
          // Insert SP notification for role 2 (Business)
          notifications.push({
            code: "TA",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        } else if (role === 4 && is_active === "N") {
          notifications.push({
            code: "TR",
            user_id,
            user_name,
            proj_id,
            proj_name: project_name,
            created_on,
          });
        }
      });
    } else if (user.role === "1") {
      // Admin
      const adminProjects = await Project.findAll({
        where: {
          user_id: user.user_id,
          is_active: "Y",
        },
        attributes: ["proj_id"],
      });

      const projIds = adminProjects.map((project) => project.proj_id);

      const applications = await ProjApplication.findAll({
        where: {
          proj_id: projIds,
          is_active: "Y",
          is_approved: "N",
          is_rejected: "N",
        },
        include: [
          {
            model: User,
            attributes: ["user_id", "username"],
            as: "user",
          },
          {
            model: Project,
            attributes: ["proj_id", "project_name"],
            as: "project",
          },
        ],
      });

      applications.forEach((application) => {
        const { proj_id, role, created_on } = application;
        const project_name = application.project.project_name;
        const user_id = application.user.user_id;
        const user_name = application.user.username;

        notifications.push({
          code: "SA",
          user_id,
          user_name,
          proj_id,
          proj_name: project_name,
          created_on,
        });
      });
    }

    notifications.sort((a, b) => {
      const dateA = new Date(a.created_on);
      const dateB = new Date(b.created_on);
      return dateB - dateA;
    });
    res.status(200).json({
      message: "Notifications list created successfully.",
      notifications,
    });
  } catch (error) {
    console.log("error --> ", error);
    res.status(500).json({
      message: "Error creating notifications list.",
      error: error.message,
    });
  }
};

// Fetch the total number of unread notifications for the current user
exports.fetchNotificationCount = async (req, res) => {
  try {
    const user = req.user;

    let notifCount = 0;

    if (user.role === "2") {
      // Business Owner
      notifCount = await Project.findAll({
        where: {
          user_id: user.user_id,
          is_active: "Y",
        },
        attributes: ["proj_id"], // Get only the proj_id
      }).then(async (projects) => {
        // Extract proj_ids from the fetched projects
        const projIds = projects.map((project) => project.proj_id);

        // Fetch the count of allocations matching proj_ids
        const allocationCount = await ProjAllocation.count({
          where: {
            proj_id: projIds,
            b_notification: "Y",
            is_active: "Y",
          },
        });
        console.log("allocationCount ---> ", allocationCount);
        return allocationCount;
      });
    } else if (user.role === "3") {
      // Supervisor
      const allocation_projIds = await ProjAllocation.findAll({
        where: {
          user_id: user.user_id,
          is_active: "Y",
        },
        attributes: ["proj_id"], // Get proj_id's
      });

      const projIds = allocation_projIds.map(
        (allocation) => allocation.proj_id
      );

      allocations = await ProjAllocation.findAll({
        where: {
          proj_id: projIds,
          s_notification: "Y",
          is_active: "Y",
        },
        include: [
          {
            model: User,
            attributes: ["user_id", "username"],
            as: "user",
          },
          {
            model: Project,
            attributes: ["proj_id", "project_name"],
            as: "project",
          },
        ],
      });

      allocations.forEach((allocation) => {
        const { role } = allocation;
        const user_id = allocation.user.user_id;
        if (role === 2 && user_id !== user.user_id) {
          return;
        } else {
          notifCount++;
        }
      });

      console.log("Before notifCount ---> ", notifCount);
      notifCount += await ProjApplication.count({
        where: {
          proj_id: projIds,
          is_active: "Y",
          is_approved: "N",
          is_rejected: "N",
        },
      });

      console.log("After notifCount ---> ", notifCount);
    } else if (user.role === "4") {
      // Student
      notifCount = await ProjAllocation.count({
        where: {
          user_id: user.user_id,
          notification: "Y",
        },
      });
    } else if (user.role === "1") {
      const adminProjects = await Project.findAll({
        where: {
          user_id: user.user_id,
          is_active: "Y",
        },
        attributes: ["proj_id"],
      });

      const projIds = adminProjects.map((project) => project.proj_id);

      notifCount = await ProjApplication.count({
        where: {
          proj_id: projIds,
          is_active: "Y",
          is_approved: "N",
          is_rejected: "N",
        },
      });
    }

    console.log("notifCount ---> ", notifCount);
    res.status(200).json({
      message: "Notification count fetched successfully.",
      notifCount,
    });
  } catch (error) {
    console.error("Error fetching notification count:", error);
    res.status(500).json({
      message: "Error fetching notification count.",
      error: error.message,
    });
  }
};

// Update notification status to mark it as read based on code and role
exports.NotificationOkay = async (req, res) => {
  try {
    const user = req.user;
    const { proj_id, user_id, code } = req.body;
    console.log(proj_id, user_id, code);

    if (!proj_id || !code) {
      return res
        .status(400)
        .json({ message: "Project ID and code are required" });
    }

    console.log(
      `Processing notification: proj_id=${proj_id}, user_id=${user_id}, code=${code}`
    );

    // Mapping notification codes to their corresponding updates
    const notificationUpdates = {
      BS: { b_notification: "N" },
      BT: { b_notification: "N" },
      SP: { s_notification: "N" },
      SV: { s_notification: "N" },
      SS: { s_notification: "N" },
      ST: { s_notification: "N" },
      TA: { notification: "N" },
    };

    // Handle special cases directly
    if (code === "BP") {
      await ProjAllocation.update(
        { b_notification: "N" },
        {
          where: {
            user_id: user.user_id,
            proj_id,
            is_active: "Y", // Ensure the record is active
          },
        }
      );
    } else if (code === "SP") {
      await ProjAllocation.update(
        { s_notification: "N" },
        {
          where: {
            user_id,
            proj_id,
            role: 2,
            is_active: "Y",
          },
        }
      );
    } else if (code === "SV") {
      await ProjAllocation.update(
        { s_notification: "N" },
        {
          where: {
            user_id,
            proj_id,
            role: 3,
            is_active: "Y",
          },
        }
      );
    } else if (code === "TR") {
      await ProjAllocation.update(
        { notification: "N" },
        {
          where: {
            user_id,
            proj_id,
            is_active: "N", // Ensure the record is inactive for TR
          },
        }
      );
    } else if (notificationUpdates[code]) {
      const updateField = notificationUpdates[code];
      await ProjAllocation.update(updateField, {
        where: {
          user_id,
          proj_id,
          is_active: "Y", // Ensure the record is active
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid notification code" });
    }

    res.status(200).json({ message: "Notification updated successfully" });
  } catch (error) {
    console.error("Error updating notification:", error.message);
    res.status(500).json({
      message: "Error updating notification",
      error: error.message,
    });
  }
};

// Send notification emails to students and supervisor when a new project is created
exports.sendProjectCreatedEmails = async (req, res) => {
  try {
    const { project_name, supervisor_email } = req.body;

    // Fetch all students' emails
    const students = await User.findAll({
      where: { role: 4 },
      attributes: ["email"],
    });

    const studentEmails = students.map((student) => student.email);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email to Students
    const studentMailOptions = {
      from: process.env.EMAIL_USER,
      to: studentEmails,
      subject: "New Project Available",
      html: `
        <p style="color: #ffffff;">Dear Student,</p>
        <p style="color: #dddddd;">A new project "<b>${project_name}</b>" has been created on SparkLink. You can check it out by clicking the button below:</p>
        <a href="http://localhost:3100/view-project"
          style="display: inline-block; padding: 12px 24px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
          View Project
        </a>
        <p style="color: #aaaaaa;">If you did not expect this email, you may ignore it.</p>
        <p style="color: #888888;">Regards,<br>Team SparkLink</p>
      `,
    };

    // Email to Supervisor (Project Creator)
    const supervisorMailOptions = {
      from: process.env.EMAIL_USER,
      to: supervisor_email,
      subject: "Project Created Successfully",
      html: `
        <p style="color: #ffffff;">Dear Supervisor,</p>
        <p style="color: #dddddd;">Your project "<b>${project_name}</b>" has been successfully created.</p>
        <a href="http://localhost:3100//view-project"
          style="display: inline-block; padding: 12px 24px; background-color: #005596; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
          View Project
        </a>
        <p style="color: #aaaaaa;">If this wasn't you, please contact support or ignore this email.</p>
        <p style="color: #888888;">Regards,<br>Team SparkLink</p>
      `,
    };

    // Send emails
    await transporter.sendMail(studentMailOptions);
    await transporter.sendMail(supervisorMailOptions);

    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Error sending emails:", error);
    res
      .status(500)
      .json({ message: "Error sending emails", error: error.message });
  }
};
