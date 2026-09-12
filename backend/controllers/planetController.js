const asyncHandler = require("express-async-handler");
const Planet = require("../models/Planet");

// @route  GET /api/planets
// @access Public
const getPlanets = asyncHandler(async (req, res) => {
  const planets = await Planet.find().sort({ order: 1, createdAt: 1 });
  res.json({ success: true, data: planets });
});

// @route  POST /api/planets
// @access Private (admin)
const createPlanet = asyncHandler(async (req, res) => {
  const planet = await Planet.create(req.body);
  res.status(201).json({ success: true, data: planet });
});

// @route  PUT /api/planets/:id
// @access Private (admin)
const updatePlanet = asyncHandler(async (req, res) => {
  const planet = await Planet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!planet) {
    res.status(404);
    throw new Error("Journey item not found");
  }
  res.json({ success: true, data: planet });
});

// @route  DELETE /api/planets/:id
// @access Private (admin)
const deletePlanet = asyncHandler(async (req, res) => {
  const planet = await Planet.findByIdAndDelete(req.params.id);
  if (!planet) {
    res.status(404);
    throw new Error("Journey item not found");
  }
  res.json({ success: true, message: "Journey item deleted" });
});

// @route  PATCH /api/planets/reorder
// @access Private (admin)
const reorderPlanets = asyncHandler(async (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) {
    res.status(400);
    throw new Error("`order` must be an array of { id, order }");
  }

  await Promise.all(
    order.map(({ id, order: pos }) => Planet.findByIdAndUpdate(id, { order: pos }))
  );

  const planets = await Planet.find().sort({ order: 1 });
  res.json({ success: true, data: planets });
});

module.exports = { getPlanets, createPlanet, updatePlanet, deletePlanet, reorderPlanets };
