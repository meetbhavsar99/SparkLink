const StudentProfile = require('../models/student_profile');
const SupervisorProfile = require('../models/supervisor_profile');
const BusinessOwnerProfile = require('../models/owner_profile');
const ProjAllocation = require("../models/proj_allocation");
const ProjectStatus = require("../models/proj_status");
const User = require('../models/user');
const Role = require('../models/role');
const Project = require('../models/project');
const { Op } = require("sequelize");
const sequelize = require('../config/db');

// app.post('/create-profile', async (req, res) => {
//   try {
//       const { user_id, bio, skills, linkedin, github, address, phone_number } = req.body;

//       if (!user_id) {
//           return res.status(400).json({ message: "User ID is required" });
//       }

//       let profile;

//       // Determine the user's role
//       const user = await User.findOne({ where: { user_id }, attributes: ['role'] });
//       if (!user) {
//           return res.status(404).json({ message: "User not found" });
//       }

//       const role = await Role.findOne({ where: { id: user.role } });
//       if (!role) {
//           return res.status(404).json({ message: "Role not found" });
//       }

//       if (role.role_desc === 'student') {
//           profile = await StudentProfile.create({ user_id, bio, skills, linkedin, github, address, phone_number });
//       } else if (role.role_desc === 'supervisor') {
//           profile = await SupervisorProfile.create({ user_id, bio, skills, linkedin, github, address, phone_number });
//       } else if (role.role_desc === 'business_owner') {
//           profile = await OwnerProfile.create({ user_id, bio, skills, linkedin, github, address, phone_number });
//       } else {
//           return res.status(400).json({ message: "Invalid role" });
//       }

//       res.status(201).json({ message: "Profile created successfully", profile });
//   } catch (error) {
//       console.error("Error creating profile:", error);
//       res.status(500).json({ message: "Error creating profile", error: error.message });
//   }
// });


exports.getProfile = async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findOne({
      where: { user_id },
      include: [{ model: Role, as: 'roleDetails', attributes: ['role_desc'] }], // Ensure role is included
    });
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // const roleDesc = user.roleDetails?.role_desc; // Extract role_desc from roleDetails
    
    // if (!roleDesc) {
    //   return res.status(400).json({ message: "Invalid role" });
    // }

    console.log("User", user);
    console.log("Fetching role for user.role ID:", user.role);
    console.log(`User Role: ${user.roleDetails.role_desc} (ID: ${user.role})`);

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
        profileExists: true,
        profile: null,  // Admins may not have a dedicated profile table
        projects: [],
      });
    }

    let bio, skills, linkedin, github, address, phone_number;

    // Fetch profile dynamically based on the role ID
    let profile = null;
    let profileExists = true;
    if (roleDesc === 'student') {
      profile = await StudentProfile.findOne({ where: { user_id } });

            if (!profile) {
                profile = await StudentProfile.create({
                    user_id,
                    avatar: null,
                    major: "",
                    graduation_year: null,
                    skills: "",
                });
                profileExists = false;
            }
      // profile = await StudentProfile.create({ user_id, bio, skills, linkedin, github, address, phone_number });
    } else if (roleDesc === 'supervisor') {
      profile = await SupervisorProfile.findOne({ where: { user_id } });
            if (!profile) {
                // If no profile exists, create a new one
                profile = await SupervisorProfile.create({
                    user_id,
                    avatar: null,
                    is_project_owner: false,
                    is_verified: false,
                });
                profileExists = false; // Allow user to fill out profile dynamically
            }
      // profile = await SupervisorProfile.create({ user_id, bio, skills, linkedin, github, address, phone_number });
    } else if (roleDesc === 'business_owner') {
      if (roleDesc === 'business_owner') {
      profile = await BusinessOwnerProfile.findOne({ where: { user_id } });

      if (!profile) {
          profile = await BusinessOwnerProfile.create({
              user_id,
              avatar: null,
              company_name: "",
              industry: "",
              is_verified: false,
          });
          profileExists = false;
      }
  }

      // profile = await OwnerProfile.create({ user_id, bio, skills, linkedin, github, address, phone_number });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

// If profile does not exist, return profileExists: false
if (!profile) {
  return res.status(200).json({
    message: "Profile not found",
    user_details: {
      user_id: user.user_id,
      username: user.username,
      email: user.email,
      name: user.name,
      isAuthenticated: true,
    },
    role: roleDesc,
    profileExists: false, // Signal frontend to show form
    profile: null,
    projects: [],
  })
  
  ;
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
      profileExists: true, // Profile exists
      profile,
      projects,
      role: roleDesc,
    });

  } catch (err) {
    console.error("Error fetching profile and projects:", err);
    res.status(500).json({ message: 'Error fetching profile and projects', error: err.message });
  }
};

exports.createProfile = async (req, res) => {
  try {
    const { user_id, role, bio, skills, linkedin, github, address, phone_number, avatar } = req.body;

      const user = await User.findOne({ where: { user_id } });
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      let profile;
      if (user.role_desc === 'student') {
          profile = await StudentProfile.create({ user_id, bio, skills, linkedin, github, address, phone_number, avatar });
      } else if (user.role_desc === 'supervisor') {
          profile = await SupervisorProfile.create({ user_id, bio, skills, linkedin, github, address, phone_number, avatar });
      } else if (user.role_desc === 'business_owner') {
          profile = await OwnerProfile.create({ user_id, bio, skills, linkedin, github, address, phone_number, avatar });
      } else {
          return res.status(400).json({ message: "Invalid role" });
      }

      res.status(201).json({ message: "Profile created successfully", profile });

  } catch (error) {
      res.status(500).json({ message: "Error creating profile", error: error.message });
  }
};


