const express = require("express");
const {
  recordEvent,
  recordResumeDownload,
  getOverview,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/auth");
const { analyticsLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post("/event", analyticsLimiter, recordEvent);
router.post("/resume-download", analyticsLimiter, recordResumeDownload);

router.get("/overview", protect, getOverview);

module.exports = router;
