const express = require("express");
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills,
} = require("../controllers/skillController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getSkills);

router.post("/", protect, createSkill);
router.patch("/reorder", protect, reorderSkills);
router.put("/:id", protect, updateSkill);
router.delete("/:id", protect, deleteSkill);

module.exports = router;
