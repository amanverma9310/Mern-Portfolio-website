const multer = require("multer");

// Files are kept in memory as a Buffer instead of being written to disk.
// Render's filesystem is ephemeral — anything saved to disk is wiped on
// every redeploy/restart — so the buffer is streamed straight to
// Cloudinary instead (see controllers/projectController.js -> uploadProjectImage).
// That way the image URL keeps working permanently, redeploys included.
const storage = multer.memoryStorage();

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];

const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, png, webp, gif, svg) are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
});

module.exports = upload;
