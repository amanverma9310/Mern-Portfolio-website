const asyncHandler = require("express-async-handler");
const Skill = require("../models/Skill");

// @route  GET /api/skills
// @access Public
const getSkills = asyncHandler(async (req, res) => {
  const skills = await Skill.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data: skills });
});

// @route  POST /api/skills
// @access Private (admin)
const createSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.create(req.body);
  res.status(201).json({ success: true, data: skill });
});

// @route  PUT /api/skills/:id
// @access Private (admin)
const updateSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!skill) {
    res.status(404);
    throw new Error("Skill not found");
  }
  res.json({ success: true, data: skill });
});

// @route  DELETE /api/skills/:id
// @access Private (admin)
const deleteSkill = asyncHandler(async (req, res) => {
  const skill = await Skill.findByIdAndDelete(req.params.id);
  if (!skill) {
    res.status(404);
    throw new Error("Skill not found");
  }
  res.json({ success: true, message: "Skill deleted" });
});

// @route  PATCH /api/skills/reorder
// @access Private (admin)
// body: { order: [{ id, order }, ...] }
const reorderSkills = asyncHandler(async (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) {
    res.status(400);
    throw new Error("`order` must be an array of { id, order }");
  }

  await Promise.all(
    order.map(({ id, order: pos }) => Skill.findByIdAndUpdate(id, { order: pos }))
  );

  const skills = await Skill.find().sort({ order: 1 });
  res.json({ success: true, data: skills });
});

module.exports = { getSkills, createSkill, updateSkill, deleteSkill, reorderSkills };
