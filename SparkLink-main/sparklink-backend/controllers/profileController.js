const StudentProfile = require('../models/student_profile');
const SupervisorProfile = require('../models/supervisor_profile');
const OwnerProfile = require('../models/owner_profile');
const ProjAllocation = require("../models/proj_allocation");
const ProjectStatus = require("../models/proj_status");
const User = require('../models/user');
const Role = require('../models/role');
const Project = require('../models/project');
const { Op } = require("sequelize");
const sequelize = require('../config/db');

exports.getProfile = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the user and their role
    const user = await User.findOne({
      where: { user_id },
      attributes: ['role', 'email', 'name', 'username'],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetching role for user.role ID:", user.role);

    const role = await Role.findOne({
      where: { id: user.role },
      attributes: ['id', 'role_desc'], // Fetch both ID and role description
  });
  
  if (!role) {
      console.error(`Role ID ${user.role} not found in t_rolesmst`);
      return res.status(404).json({ message: `Role ID ${user.role} not found in t_rolesmst` });
  }
  
  const roleDesc = role.role_desc;
  const role_id = role.id;  // Now, we dynamically get the role ID
  console.log(`User Role: ${roleDesc} (ID: ${role_id})`);
  

    // Check for admin role
    if (roleDesc === 'admin') {
      return res.status(200).json({
        message: "Admin profile loaded successfully",
        user_details: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          name: user.name,
          isAuthenticated: true,
        },
        role: roleDesc,
        profile: null,  // Admins may not have a dedicated profile table
        projects: [],
      });
    }

    // Fetch profile dynamically based on the role ID
let profile;
if (roleDesc === 'student') {
  profile = await StudentProfile.findOne({ where: { user_id } });
} else if (roleDesc === 'supervisor') {
  profile = await SupervisorProfile.findOne({ where: { user_id } });
} else if (roleDesc === 'business_owner') {
  profile = await OwnerProfile.findOne({ where: { user_id } });
} else {
    return res.status(400).json({ message: "Invalid role" });
}

if (!profile) {
    return res.status(404).json({ message: "Profile not found" });
}

  

    // Fetch projects related to the user
    const projectsQuery = `
      SELECT pr.*, ps.status_desc
      FROM t_project pr, t_proj_status ps, t_proj_allocation pa
      WHERE pr.is_active = 'Y'
      and pr.status = ps.status_id
      and pa.proj_id = pr.proj_id
      and pa.user_id = :user_id
      and pa.is_active = 'Y'
      order by pr.created_on desc
      limit 50;
    `;

    const projects = await sequelize.query(projectsQuery, {
      replacements: { user_id },
      type: sequelize.QueryTypes.SELECT,
    });

    res.status(200).json({
      message: 'Profile and projects fetched successfully',
      user_details: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        name: user.name,
        isAuthenticated: true,
      },
      profile,
      projects,
      role: roleDesc,
    });

  } catch (err) {
    console.error("Error fetching profile and projects:", err);
    res.status(500).json({ message: 'Error fetching profile and projects', error: err.message });
  }
};

