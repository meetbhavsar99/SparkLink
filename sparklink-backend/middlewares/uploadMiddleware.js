const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define destination folder
const uploadFolder = path.join(__dirname, "../uploads/group_pdfs");

// ✅ Ensure folder exists
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

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

const upload = multer({ storage });

module.exports = upload;
