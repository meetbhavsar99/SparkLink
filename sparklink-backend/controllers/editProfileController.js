const Student_profile = require('../models/student_profile');
const Supervisor_profile = require('../models/supervisor_profile');
const Owner_profile = require('../models/owner_profile');
const User = require('../models/user');
const Role = require('../models/role');
const Project = require('../models/project');

const { createLog } = require("../controllers/logsController");

exports.getProfile = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    console.log("user id =============== ", user_id);

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch the user and their role
    const user = await User.findOne({
      where: { user_id },
      attributes: ['role'], // Only fetch the role field
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = await Role.findOne({
      where: { id: user.role },
      attributes: ['role_desc'], // Only fetch the role description
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const roleDesc = role.role_desc;
    console.log(`Role: ${roleDesc}`);

    // Fetch the profile based on the role
    let profile;
    if (roleDesc === 'student') {
      profile = await Student_profile.findOne({ where: { user_id } });
    } else if (roleDesc === 'supervisor') {
      profile = await Supervisor_profile.findOne({ where: { user_id } });
    } else if (roleDesc === 'business_owner') {
      profile = await Owner_profile.findOne({ where: { user_id } });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Fetch the projects for the user
    const projects = await Project.findAll({
      where: { user_id },
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

exports.updateProfile = async (req, res) => {
  console.log("INSIDE UPDATE PROFILE");
  try {
    // const user_id = req.user.user_id;
    // const updatedProfileData = req.body;
    const {
      user_id, bio, skills, linkedin, github, address,
      phone_number, avatar, department, domain, expertise, education, experience, course
    } = req.body;

    console.log("Updating profile with data:", { bio, skills, linkedin, github, address, phone_number, avatar });

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findOne({
      where: { user_id },
      attributes: ['role'],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = await Role.findOne({
      where: { id: user.role },
      attributes: ['role_desc'],
    });

    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    const roleDesc = role.role_desc;
    let profileModel;

    if (roleDesc === 'student') {
      profileModel = Student_profile;
    } else if (roleDesc === 'supervisor') {
      profileModel = Supervisor_profile;
    } else if (roleDesc === 'business_owner') {
      profileModel = Owner_profile;
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Fix: Ensure profile update uses `where` condition
    // const [updatedRows] = await profileModel.update(
    //   { bio, skills, linkedin, github, address, phone_number, avatar }, 
    //   { where: { user_id } } 
    // );
    const updateData = {
      bio, skills, linkedin, github, address,
      phone_number, avatar, department, domain,
      expertise, education, experience, course
    };


    // Only update avatar if it's provided
    if (avatar) {
        updateData.avatar = avatar;
    }

    const [updatedRows] = await profileModel.update(updateData, { where: { user_id } });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Profile update failed" });
    }

    const updatedProfile = await profileModel.findOne({
      where: { user_id },
    });

    if (!updatedProfile) {
      return res.status(404).json({ message: "Profile not found after update" });
    }

    await createLog(user_id, "Profile Updated", "User updated their profile.", "action");

    return res.status(200).json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
};
