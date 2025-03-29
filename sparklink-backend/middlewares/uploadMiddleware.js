// Middleware to handle file uploads using multer (stores uploaded PDFs for student groups)
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define destination folder
const uploadFolder = path.join(__dirname, "../uploads/group_pdfs");

// Ensure the upload folder exists; create if not
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

// Define custom storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder);
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const sanitized = file.originalname.replace(/\s+/g, "_");
    cb(null, `${timestamp}-${sanitized}`);
  },
});

// Initialize multer with the defined storage engine
const upload = multer({ storage });

module.exports = upload;
