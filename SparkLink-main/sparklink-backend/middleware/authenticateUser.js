const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get the token from the Authorization header
  if (!token) {
    return res.status(401).json({ message: "Authentication token missing" });
  }he

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using your secret
    req.user = decoded; // Attach user data to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticateUser;
