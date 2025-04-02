// Controller to manage user-related operations including registration, authentication, password reset, and recommendation engine
require("dotenv").config();
const Role = require("../models/role"); // Import Role model
const User = require("../models/user");
const SupervisorProfile = require("../models/supervisor_profile");
const BusinessOwner = require("../models/owner_profile");
const StudentProfile = require("../models/student_profile");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const passport = require("../config/passportConfig");
const { Op } = require("sequelize");
const { getTop5RecommendedProjects } = require("../queue/skillextraction");
const sequelize = require("../config/db");

const { createLog } = require("../controllers/logsController");

// Register a new user and send confirmation email (includes elevated role validation and admin notification)
exports.register = async (req, res) => {
  try {
    // const { username, email, password, name, role } = req.body;

    const { username, email, password, name, role, secret } = req.body;

    const SUPERVISOR_SECRET = "secret123";
    const ADMIN_SECRET = "admin456";
    const userRole = String(role);

    console.log("Backend received:", { role, secret });
    // Step 1: Secure role validation
    if (userRole !== "4") {
      if (
        (userRole === "1" && secret !== ADMIN_SECRET) ||
        ((userRole === "2" || userRole === "3") && secret !== SUPERVISOR_SECRET)
      ) {
        console.log("Secret mismatch or invalid role");
        return res
          .status(403)
          .json({ message: "Unauthorized access to elevated role." });
      }
    }

    // Check if required fields are missing
    if (!username || !email || !password || !name || !role) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken!" });
    }

    // Check if role exists in `t_rolesmst`
    const roleExists = await Role.findOne({ where: { id: role } });
    if (!roleExists) {
      return res.status(400).json({ message: "Invalid role ID!" });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique confirmation token
    const confirmation_token = crypto.randomBytes(32).toString("hex");

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password,
      name,
      role,
      created_by: 1,
      modified_by: 1,
      confirmation_token, // Store token
      is_active: "N", // Initially inactive
      is_verified: "N",
      is_approved: role === "4" ? "Y" : "N",
    });

    // Log user registration
    await createLog(
      newUser.user_id,
      "User Registration",
      `User ${newUser.username} registered with role ${roleExists.role_desc}.`,
      "user"
    );

    // Send email with confirmation link
    const confirmationLink = `http://localhost:5100/api/users/confirm-email?token=${confirmation_token}`;

    res.status(201).json({
      message: "User registered successfully! Please confirm your email.",
      user: newUser,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Confirm Your Email",
      html: `
        <p>Dear ${username},</p>
        <p>Thank you for registering with SparkLink! Please confirm your email address by clicking the button below:</p>
        <a href="${confirmationLink}" 
          style="display: inline-block; padding: 12px 24px; background-color: #005596; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
          Confirm Your Email
        </a>
        <p>If you did not register, please ignore this email.</p>
        <p>Regards,<br>Team SparkLink</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent!");

    // Notify all admins if elevated role is registered
    //   if (role !== "4") {
    //     const admins = await User.findAll({
    //       where: { role: "1", is_active: "Y" },
    //       attributes: ["email"],
    //     });

    //     const adminEmails = admins.map((admin) => admin.email);

    //     const adminProfileLink = `http://localhost:3100/admin/view-users`;

    //     const mailHTML = `
    //   <div style="font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
    //     <h2 style="color: #FFCE00;">New Elevated Role Registration</h2>
    //     <p>A new user has registered with elevated access on SparkLink:</p>
    //     <ul style="line-height: 1.6;">
    //       <li><strong>Name:</strong> ${name}</li>
    //       <li><strong>Email:</strong> ${email}</li>
    //       <li><strong>Username:</strong> ${username}</li>
    //       <li><strong>Role:</strong> ${role}</li>
    //     </ul>

    //     ${
    //       adminProfileLink
    //         ? `<a href="${adminProfileLink}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #005596; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
    //             View Users
    //           </a>`
    //         : ""
    //     }

    //     <p style="margin-top: 30px;">Regards,<br><strong>Team SparkLink</strong></p>
    //   </div>
    // `;

    //     if (adminEmails.length > 0) {
    //       await transporter.sendMail({
    //         from: process.env.EMAIL_USER,
    //         to: adminEmails,
    //         subject: "New Elevated Role Registration",
    //         html: mailHTML,
    //       });
    //       console.log("Admins notified of elevated role registration.");
    //     } else {
    //       console.log("No admins found to notify.");
    //     }
    //   }

    if (role !== "4") {
      const admins = await User.findAll({
        where: { role: "1", is_active: "Y" },
        attributes: ["email"],
      });

      const adminEmails = admins.map((admin) => admin.email);

      const adminProfileLink = `http://localhost:3100/admin/view-users`;

      // 1. Send notification email
      const mailHTML = `
    <div style="font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
      <h2 style="color: #FFCE00;">New Elevated Role Registration</h2>
      <p>A new user has registered with elevated access on SparkLink:</p>
      <ul style="line-height: 1.6;">
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Username:</strong> ${username}</li>
        <li><strong>Role:</strong> ${role}</li>
      </ul>

      ${
        adminProfileLink
          ? `<a href="${adminProfileLink}" style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #005596; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
              View Users
            </a>`
          : ""
      }

      <p style="margin-top: 30px;">Regards,<br><strong>Team SparkLink</strong></p>
    </div>
  `;

      if (adminEmails.length > 0) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: adminEmails,
          subject: "New Elevated Role Registration",
          html: mailHTML,
        });
        console.log("Admins notified of elevated role registration.");
      }

      // 2. Send approval email with token
      const approval_token = crypto.randomBytes(32).toString("hex");
      newUser.approval_token = approval_token;
      await newUser.save();

      const approvalLink = `http://localhost:5100/api/users/approve?token=${approval_token}`;
      const approvalHTML = `
  <div style="font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; padding: 20px; border-radius: 8px;">
    <h2 style="color: #FFCE00;">Approval Needed: Elevated Role Registration</h2>
    <p>A new user has registered with elevated access on SparkLink. Please review and approve their account:</p>
    
    <ul style="line-height: 1.6;">
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Username:</strong> ${username}</li>
      <li><strong>Role:</strong> ${role}</li>
    </ul>

    <a href="${approvalLink}" 
      style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #005596; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
      Approve Account
    </a>

    <p style="margin-top: 30px;">Regards,<br><strong>Team SparkLink</strong></p>
  </div>
`;

      if (adminEmails.length > 0) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: adminEmails,
          subject: "Approval Needed: Elevated Role Registration",
          html: approvalHTML,
        });
        console.log("Approval email sent to admins.");
      }
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      message: "Registration failed. Try again.",
      error: error.message,
    });
  }
};

// Confirm user's email using token and activate the account
exports.confirmEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    // Find the user by confirmation token
    const user = await User.findOne({ where: { confirmation_token: token } });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Mark user as verified
    user.is_verified = "Y";
    // Activate the user account
    user.is_active = "Y";
    user.confirmation_token = null; // Clear the token after confirmation
    await user.save();

    return res.redirect(
      "http://localhost:3100/login?message=Email confirmed successfully. You can now log in."
    );
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error confirming email", error: error.message });
  }
};

// Placeholder for registering supervisor (not implemented)
exports.registerSupervisor = async (req, res) => {};

// Authenticate user and start session if login is successful
exports.login = async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Authentication error", error: err });
    }
    if (!user) {
      await createLog(
        null,
        "Failed Login",
        `Attempted login for ${req.body.username}`,
        "error"
      );
      return res
        .status(401)
        .json({ message: info.message || "Invalid credentials" });
    }

    if (user.is_verified === "N") {
      await createLog(
        user.user_id,
        "Unverified Login Attempt",
        `Unverified user ${user.username} attempted login.`,
        "error"
      );
      return res
        .status(403)
        .json({ message: "Please confirm your account before logging in." });
    }

    // Block login if not approved by admin
    if (user.is_approved === "N" && user.role !== 4) {
      await createLog(
        user.user_id,
        "Unapproved Login Attempt",
        `Unapproved user ${user.username} attempted login.`,
        "error"
      );
      return res.status(403).json({
        message: "Your account is pending admin approval. Please wait.",
      });
    }

    // Debugging: Log the stored hashed password for comparison
    console.log("Stored Hashed Password:", user.password);

    req.logIn(user, async (err) => {
      if (err) {
        return res.status(500).json({ message: "Login failed", error: err });
      }

      // Log user login
      await createLog(
        user.user_id,
        "User Login",
        `User ${user.username} logged in successfully.`,
        "user"
      );

      // Send success message, user data, and redirect URL in the response
      return res.status(200).json({
        message: "Login successful",
        user: {
          username: user.username,
          email: user.email,
          role: user.role,
          isAuthenticated: true,
          user_id: user.user_id,
          is_verified: user.is_verified,
          is_active: user.is_active,
        },
      });
    });
  })(req, res, next);
};

// Logout the current authenticated user and destroy session
exports.logout = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "User not logged in" });

  req.logout((err) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error while logging out", error: err });

    req.session.destroy((err) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error while destroying session", error: err });
      return res.status(200).json({ message: "Logged out successfully" });
    });
  });
};

// Check if session exists and return basic user info
exports.checkSession = (req, res) => {
  if (req.isAuthenticated()) {
    // User is authenticated, send back user details
    const { username, email, role, user_id } = req.user;
    return res.status(200).json({
      isAuthenticated: true,
      user: { username, email, role, user_id },
    });
  } else {
    // User is not authenticated
    return res.status(200).json({
      isAuthenticated: false,
    });
  }
};

// Check if the user is an Admin or Supervisor
exports.authStatus = (req, res) => {
  if (req.isAuthenticated()) {
    if (
      req.user.role === "1" ||
      req.user.role === "2" ||
      req.user.role === "1,2"
    ) {
      console.log("hi");
      return res.status(200).json({ isAuthenticated: true, user: req.user });
    } else {
      return res.status(501).json({ isAuthenticated: false, user: req.user });
    }
  } else {
    console.log("heyyy");
    return res.status(200).json({ isAuthenticated: false });
  }
};

// Check if user is Supervisor or Admin (specialized auth check)
exports.authStatusSupervisorOrAdmin = (req, res) => {
  if (req.isAuthenticated()) {
    if (req.user.role === "1" || req.user.role === "2") console.log("hi");
    return res.status(200).json({ isAuthenticated: true, user: req.user });
  } else {
    console.log("heyyy");
    return res.status(200).json({ isAuthenticated: false });
  }
};

// Initiate password reset by generating and emailing reset token
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User With This Email Does not Exist" });
    }

    const reset_token = crypto.randomBytes(32).toString("hex");
    const hashed_token = crypto
      .createHash("sha256")
      .update(reset_token)
      .digest("hex"); // Hashed token
    const reset_token_expires = new Date(Date.now() + 3600000);

    console.log("date", reset_token_expires);

    user.resetpasswordtoken = hashed_token;
    user.resetpasswordexpires = reset_token_expires;
    await user.save();

    const resetLink = `http://localhost:3100/reset-password?token=${reset_token}`;

    // Send a confirmation email with the link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Dear User,</p>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Click here to reset your password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>Regards,<br>Your Team</p>
      `,
    });

    // Log password reset request
    await createLog(
      user.user_id,
      "Password Reset Requested",
      `User ${user.username} requested a password reset.`,
      "action"
    );

    res
      .status(200)
      .json({ message: "Password reset link sent. Check your email." });
  } catch (error) {
    console.log("error ", error.message);
    res
      .status(500)
      .json({ message: "Error in password reset", error: error.message });
  }
};

// Verify if the provided password reset token is valid and not expired
exports.verifyToken = async (req, res) => {
  try {
    const { token } = req.query;
    const hashed_token = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex"); // Hashed token
    const user = await User.findOne({
      where: {
        resetpasswordtoken: hashed_token,
        resetpasswordexpires: { [Op.gt]: new Date() }, // Ensure token hasn't expired
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    res.status(200).json({ message: "Token is valid." });
  } catch (error) {
    console.log("error ", error.message);
    res
      .status(500)
      .json({ message: "Error verifying token.", error: error.message });
  }
};

// Reset the user's password using the verified reset token
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const hashed_token = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex"); // Hashed token
    const user = await User.findOne({
      where: {
        resetpasswordtoken: hashed_token,
        resetpasswordexpires: { [Op.gt]: new Date() }, // Ensure token hasn't expired
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Update the user's password
    user.password = newPassword; // The `beforeUpdate` hook will handle hashing

    // Clear reset token fields
    user.resetpasswordtoken = null;
    user.resetpasswordexpires = null;

    await user.save();

    // Log successful password reset
    await createLog(
      user.user_id,
      "Password Reset Success",
      `User ${user.username} successfully reset their password.`,
      "action"
    );

    res.status(200).json({ message: "Password has been successfully reset." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error resetting password.", error: error.message });
  }
};

// Fetch all users from the database
exports.getallusers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update user details by user ID (admin or self-edit)
exports.updateuser = async (req, res) => {
  try {
    const { id } = req.params; // User ID from the route
    const { username, email, name, role, is_active, modified_by } = req.body; // Data from request

    // Find the user by ID and update
    const [updated] = await User.update(
      {
        username,
        email,
        name,
        role,
        is_active,
        modified_by: req.user.user_id,
      },
      { where: { user_id: id }, returning: true }
    );

    if (updated === 0) {
      return res
        .status(404)
        .json({ message: "User not found or no changes made." });
    }

    await createLog(
      id,
      "Profile Update",
      `User ${username} updated their profile`,
      "action"
    );

    // Return the updated user
    const updatedUser = await User.findByPk(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

// Soft-delete a user by marking their account as inactive
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // User ID from the route

    // Find the user by ID
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Mark the user as inactive or delete them
    await User.update({ is_active: "N" }, { where: { user_id: id } });

    // Log user deletion
    await createLog(
      user.user_id,
      "User Deletion",
      `User ${user.username} was deleted (marked inactive).`,
      "action"
    );

    res
      .status(200)
      .json({ message: "User successfully deleted (marked inactive)." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting user", error: error.message });
  }
};

// Get top 5 recommended projects for a student based on profile and project skills
exports.get5recommendedProjects = async (req, res) => {
  try {
    const user = req.user; // Get the whole user object from req.user
    console.log("user skills");

    // Fetching the student profile based on user_id
    const studentProfile = await StudentProfile.findOne({
      where: { user_id: user.user_id }, // Querying by user_id (from req.user)
      attributes: ["skills"], // Only fetch the specified fields
    });

    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    // Split and trim the skills list
    const skillsList = studentProfile.skills
      ? studentProfile.skills
          .split(",")
          .map((skill) => skill.trim()) // Remove any surrounding spaces
          .filter((skill) => skill.length > 0) // Remove any empty strings
      : [];

    // Fetch projects associated with the user
    const projectsWithSkills = await sequelize.query(
      `
        SELECT DISTINCT tp.skills_req
        FROM t_proj_allocation tup
        JOIN t_project tp ON tup.proj_id = tp.proj_id
        WHERE tup.user_id = :userId
        AND tup.is_active = 'Y'
        `,
      {
        replacements: { userId: user.user_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Extract and combine skills from the fetched projects
    const projectSkills = projectsWithSkills
      .map((project) => project.skills_req) // Get the required skills field
      .filter((skills) => skills) // Make sure skills_req exists
      .map((skills) => skills.split(","))
      .flat()
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0);

    console.log(projectSkills);

    const allSkills = [...new Set([...skillsList, ...projectSkills])];
    console.log("Merged Skills List:", allSkills);
    // Fetch all projects with required skills
    const projectsWithSkillsa = await sequelize.query(
      `
        SELECT proj_id, skills_req
  FROM t_project tp
  WHERE skills_req IS NOT NULL
  AND NOT EXISTS (
      SELECT 1
      FROM t_proj_allocation tpa
      WHERE tpa.proj_id = tp.proj_id
      AND tpa.user_id = :userId -- Exclude projects where the user is already allocated
  )
        `,
      {
        replacements: { userId: user.user_id },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    const recommendedProjects = [];

    for (const project of projectsWithSkillsa) {
      const { proj_id, skills_req } = project;

      // Check if skills_req is valid
      if (skills_req) {
        // Split and trim the project's required skills
        const projectSkills = skills_req
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0);

        // Find the intersection of user skills and project skills
        const commonSkills = allSkills.filter((skill) =>
          projectSkills.includes(skill)
        );

        // Calculate the match percentage
        const matchPercentage =
          (commonSkills.length / projectSkills.length) * 100;

        // If matchPercentage is more than 60%, add to recommended list
        if (matchPercentage > 40) {
          recommendedProjects.push({
            proj_id,
            matchPercentage,
            commonSkills,
          });
        }
      } else {
        console.log(`Project ${proj_id} has no required skills.`);
      }
    }

    // Sort projects by match percentage in descending order
    recommendedProjects.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Limit to top 5 recommended projects
    const top5Projects = recommendedProjects.slice(0, 5);

    console.log(top5Projects);
    const recommendedProjectIds = top5Projects.map(
      (project) => project.proj_id
    ); // Extracting the proj_id of the top 5 recommended projects

    const projectsQuery = `
    SELECT pr.*, ps.status_desc
    FROM t_project pr
    JOIN t_proj_status ps ON pr.status = ps.status_id
    WHERE pr.is_active = 'Y'
    AND pr.proj_id IN (:recommendedProjectIds)  
    ORDER BY pr.created_on DESC
    LIMIT 50;
  `;
    const projects = await sequelize.query(projectsQuery, {
      replacements: { recommendedProjectIds: recommendedProjectIds },
      type: sequelize.QueryTypes.SELECT,
    });

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
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
        isAuthenticated: true,
      },
    });

    // Respond with the projects whose match percentage is more than 60%

    // Handle case where no projects with required skills were found
  } catch (error) {
    console.error("Error fetching recommended projects:", error);
    return res
      .status(500)
      .json({ message: "Error fetching recommended projects" });
  }
};

exports.approveUser = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: "Missing token" });
    }

    const user = await User.findOne({ where: { approval_token: token } });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Invalid or expired approval token." });
    }

    user.is_active = "Y";
    // user.is_verified = "Y";
    user.is_approved = "Y";
    await user.save();

    await createLog(
      user.user_id,
      "Admin Approved Account",
      `Admin approved user ${user.username}'s elevated access.`,
      "admin"
    );

    res.send(`<h3>User approved successfully. They can now log in.</h3>`);
  } catch (error) {
    console.error("Error approving user:", error);
    res.status(500).json({ message: "Approval failed", error: error.message });
  }
};
