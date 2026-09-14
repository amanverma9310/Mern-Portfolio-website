const express = require("express");
const { body } = require("express-validator");
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  uploadProjectImage,
} = require("../controllers/projectController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

const projectValidation = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("image").trim().notEmpty().withMessage("Image URL is required"),
];

router.get("/", getProjects);
router.get("/:id", getProjectById);

// Upload a project image file -> Cloudinary, returns { data: { url } }.
// Must come before "/:id" style routes only matters for GET; POST "/upload"
// vs POST "/" never collide, but keeping it grouped here for clarity.
router.post("/upload", protect, upload.single("image"), uploadProjectImage);

router.post("/", protect, projectValidation, createProject);
router.put("/:id", protect, updateProject);
router.delete("/:id", protect, deleteProject);

module.exports = router;
