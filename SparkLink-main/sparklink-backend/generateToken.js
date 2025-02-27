const jwt = require("jsonwebtoken");

// Common secret key
const secret = "your_super_secret_key";

// Users to generate tokens for
const users = [
  { user_id: 1, username: "Admin", role: 1 }, // Admin
  { user_id: 2, username: "SupervisorUser", role: 3 }, // Supervisor
  { user_id: 3, username: "BusinessOwner", role: 2 }, // Business Owner
];

// Generate tokens
users.forEach((user) => {
  const token = jwt.sign(user, secret, { expiresIn: "1h" });
  console.log(`Generated Token for ${user.username} (Role: ${user.role}):`, token);
});
