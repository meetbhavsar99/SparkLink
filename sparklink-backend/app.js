/**
 * Main server configuration file for SparkLink application.
 * - Initializes Express app with all required middleware
 * - Configures session management and Passport authentication
 * - Connects to the database using Sequelize
 * - Registers all API route handlers
 * - Starts the Express server
 */

// Load environment variables from .env
// This should be the first thing to run
// This will load the environment variables from the .env file into process.env
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/db"); // Import the database connection
const passport = require("./config/passportConfig");
const session = require("express-session");
const User = require("./models/user");
const Log = require("./models/logs"); // Import Log model

// Routes

const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const projectStatusRouter = require("./routes/projectStatusRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const projectRouter = require("./routes/projectRoutes");
const profileRouter = require("./routes/profileRoutes");
const EditProfileRouter = require("./routes/editProfileRoute");
const projApplicationRouter = require("./routes/projectApplicationRoutes");
const projAllocationRouter = require("./routes/projectAllocationRoutes");
const userRouter = require("./routes/userRoutes");
const progressTrackerRouter = require("./routes/progressTrackerRoutes");
const notificationRouter = require("./routes/notificationRoutes");
const contactRoutes = require("./routes/contactRoutes");
const systemSettingsRoutes = require("./routes/systemSettingsRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const logRoutes = require("./routes/logs");
const groupRoutes = require("./routes/groupRoutes");

//const adminRoutes = require("./routes/adminRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:3100", // React frontend
  "http://10.0.2.2:5100", // Flutter emulator
  "http://localhost:5100/",
  "http://localhost:5100",
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("Incoming Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow
    } else {
      console.error("Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies or authentication headers
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, sameSite: "Lax" }, // Set secure: true if using HTTPS in production
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    return sequelize.sync();
  })
  .then(() => {
    console.log("Database synced successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Define routes
app.use("/api/users", userRoutes); // Route for user-related requests
app.use("/api", roleRoutes); // Route for role-related requests
app.use("/projectstatus", projectStatusRouter);
app.use("/department", departmentRoutes);
app.use("/project", projectRouter);
app.use("/api/profile", profileRouter);
app.use("/editProfile", EditProfileRouter);
app.use("/contact", contactRoutes);
app.use("/progressTracker", progressTrackerRouter);
app.use("/api/settings", systemSettingsRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api", logRoutes);
app.use("/api/notifications", notificationRouter);
app.use("/api/group", groupRoutes);
// Error handling middleware

// Middleware to check if the user is authenticated via Passport session
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // Store the path the user tried to access
  return res.status(200).json({ isAuthenticated: false });
}

// Define routes
app.use("/projectstatus", isAuthenticated, projectStatusRouter);
app.use("/department", isAuthenticated, departmentRoutes);
app.use("/project", projectRouter);
app.use("/profile", profileRouter);
app.use("/editProfile", EditProfileRouter);
app.use("/apply", projApplicationRouter);
app.use("/alloc", projAllocationRouter);
app.use("/notify", notificationRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Debug route to check current session user information (for testing)
app.get("/status", (req, res) => {
  console.log("Inside status end point");
  console.log(req.user);
  console.log(req.session);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

/**
 * Route to create user profiles based on role.
 * - Determines role (student, supervisor, business_owner)
 * - Creates corresponding profile with provided information
 */
app.post("/create-profile", async (req, res) => {
  try {
    const { user_id, bio, skills, linkedin, github, address, phone_number } =
      req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let profile;

    // Determine the user's role
    const user = await User.findOne({
      where: { user_id },
      attributes: ["role"],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const role = await Role.findOne({ where: { id: user.role } });
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }

    if (role.role_desc === "student") {
      profile = await StudentProfile.create({
        user_id,
        bio,
        skills,
        linkedin,
        github,
        address,
        phone_number,
      });
    } else if (role.role_desc === "supervisor") {
      profile = await SupervisorProfile.create({
        user_id,
        bio,
        skills,
        linkedin,
        github,
        address,
        phone_number,
      });
    } else if (role.role_desc === "business_owner") {
      profile = await OwnerProfile.create({
        user_id,
        bio,
        skills,
        linkedin,
        github,
        address,
        phone_number,
      });
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    res.status(201).json({ message: "Profile created successfully", profile });
  } catch (error) {
    console.error("Error creating profile:", error);
    res
      .status(500)
      .json({ message: "Error creating profile", error: error.message });
  }
});

// Start the server
const PORT = 5100;
// Start the Express server on the specified PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
