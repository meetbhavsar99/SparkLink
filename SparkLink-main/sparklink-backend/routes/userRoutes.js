
const express = require('express');
const { register, login, confirmEmail, logout, checkSession, authStatus, forgotPassword, verifyToken, resetPassword, getallusers, updateuser, deleteUser, get5recommendedProjects} = require('../controllers/userController');

const router = express.Router();

// POST route for user registration
router.post("/register", register);
router.get("/confirm-email", confirmEmail);

// POST route for user login
router.post('/login', login);
router.post('/logout', logout);
router.get('/auth-status',checkSession);
router.post('/forgot-password', forgotPassword);
router.get('/allusers',getallusers);
router.put('/delete/:id',deleteUser);
router.put('/:id',updateuser);
router.get('/recommendedprojects',get5recommendedProjects);


router.get("/reset-password", verifyToken);
router.post("/reset-password", resetPassword);
// router.post('/reset-email-sent', sendResetEmail);

router.delete("/delete/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      // Ensure user exists before deleting
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      await user.destroy(); // Delete the user
      res.status(200).json({ message: "User deleted successfully" });
  
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });
  
  
  

router.post("/bulk-delete", async (req, res) => {
  try {
    const { user_ids } = req.body;

    if (!user_ids || user_ids.length === 0) {
      return res.status(400).json({ error: "No users selected for deletion" });
    }

    // Find users to delete
    const usersToDelete = await User.findAll({ where: { user_id: user_ids } });

    if (usersToDelete.length === 0) {
      return res.status(404).json({ error: "Users not found" });
    }

    await User.destroy({ where: { user_id: user_ids } });

    res.status(200).json({ message: "Selected users deleted successfully" });

  } catch (error) {
    console.error("Error in bulk deleting users:", error);
    res.status(500).json({ error: "Failed to delete selected users" });
  }
});

  
  

module.exports = router;
