const express = require("express");
const {
  getPublicSettings,
  getAdminSettings,
  updateSettings,
} = require("../controllers/settingsController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", getPublicSettings);
router.get("/admin", protect, getAdminSettings);
router.put("/", protect, updateSettings);

module.exports = router;
