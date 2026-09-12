const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Project = require("../models/Project");

// @route  GET /api/projects
// @access Public
const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json({ success: true, data: projects });
});

// @route  GET /api/projects/:id
// @access Public
const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json({ success: true, data: project });
});

// @route  POST /api/projects
// @access Private (admin)
const createProject = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const project = await Project.create(req.body);
  res.status(201).json({ success: true, data: project });
});

// @route  PUT /api/projects/:id
// @access Private (admin)
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  res.json({ success: true, data: project });
});

// @route  DELETE /api/projects/:id
// @access Private (admin)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }
  res.json({ success: true, message: "Project deleted" });
});

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
