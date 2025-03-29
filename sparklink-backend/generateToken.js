/**
 * Utility script to generate JWT tokens for predefined users.
 * - Used for testing or development purposes
 * - Uses a shared secret and signs tokens with a 1-hour expiration
 */
const jwt = require("jsonwebtoken");

// Common secret key
const secret = "your_super_secret_key";

// Users to generate tokens for
const users = [
  { user_id: 1, username: "Admin", role: 1 }, // Admin
  { user_id: 2, username: "SupervisorUser", role: 3 }, // Supervisor
  { user_id: 3, username: "BusinessOwner", role: 2 }, // Business Owner
];

// Generate and print a JWT token for each user with role-based payload
users.forEach((user) => {
  const token = jwt.sign(user, secret, { expiresIn: "1h" });
  console.log(
    `Generated Token for ${user.username} (Role: ${user.role}):`,
    token
  );
});
