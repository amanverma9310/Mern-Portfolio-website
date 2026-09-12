const express = require("express");
const {
  getPlanets,
  createPlanet,
  updatePlanet,
  deletePlanet,
  reorderPlanets,
} = require("../controllers/planetController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getPlanets);

router.post("/", protect, createPlanet);
router.patch("/reorder", protect, reorderPlanets);
router.put("/:id", protect, updatePlanet);
router.delete("/:id", protect, deletePlanet);

module.exports = router;
