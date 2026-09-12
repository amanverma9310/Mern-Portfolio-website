const asyncHandler = require("express-async-handler");
const AnalyticsEvent = require("../models/AnalyticsEvent");
const Contact = require("../models/Contact");
const Project = require("../models/Project");

const ALLOWED_EVENT_TYPES = ["page_view", "project_view", "resume_download"];

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}
function startOfWeek() {
  const d = startOfToday();
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  return d;
}
function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

// @route  POST /api/analytics/event
// @access Public (rate-limited)
// body: { eventType: "page_view" | "project_view", page?, projectId?, sessionId? }
const recordEvent = asyncHandler(async (req, res) => {
  const { eventType, page, projectId, sessionId } = req.body;

  if (!ALLOWED_EVENT_TYPES.includes(eventType)) {
    res.status(400);
    throw new Error(`eventType must be one of: ${ALLOWED_EVENT_TYPES.join(", ")}`);
  }

  const event = await AnalyticsEvent.create({
    eventType,
    page,
    projectId: projectId || undefined,
    sessionId,
  });

  if (eventType === "project_view" && projectId) {
    Project.findByIdAndUpdate(projectId, { $inc: { views: 1 } }).catch(() => {});
  }

  res.status(201).json({ success: true, data: { id: event._id } });
});

// @route  POST /api/analytics/resume-download
// @access Public (rate-limited)
const recordResumeDownload = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  await AnalyticsEvent.create({ eventType: "resume_download", sessionId });
  res.status(201).json({ success: true });
});

// @route  GET /api/analytics/overview
// @access Private (admin)
const getOverview = asyncHandler(async (req, res) => {
  const [
    totalVisits,
    visitsToday,
    visitsThisWeek,
    visitsThisMonth,
    totalMessages,
    newMessages,
    resumeDownloads,
    totalProjectViews,
    recentMessages,
    mostViewedProjects,
  ] = await Promise.all([
    AnalyticsEvent.countDocuments({ eventType: "page_view" }),
    AnalyticsEvent.countDocuments({ eventType: "page_view", timestamp: { $gte: startOfToday() } }),
    AnalyticsEvent.countDocuments({ eventType: "page_view", timestamp: { $gte: startOfWeek() } }),
    AnalyticsEvent.countDocuments({ eventType: "page_view", timestamp: { $gte: startOfMonth() } }),
    Contact.countDocuments(),
    Contact.countDocuments({ status: "New" }),
    AnalyticsEvent.countDocuments({ eventType: "resume_download" }),
    AnalyticsEvent.countDocuments({ eventType: "project_view" }),
    Contact.find().sort({ createdAt: -1 }).limit(5),
    Project.find().sort({ views: -1 }).limit(5).select("title views"),
  ]);

  res.json({
    success: true,
    data: {
      totalVisitors: totalVisits,
      todaysVisitors: visitsToday,
      visitsThisWeek,
      visitsThisMonth,
      totalMessages,
      newMessages,
      resumeDownloads,
      totalProjectViews,
      recentMessages,
      mostViewedProjects,
    },
  });
});

module.exports = { recordEvent, recordResumeDownload, getOverview };
