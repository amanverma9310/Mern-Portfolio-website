const mongoose = require("mongoose");

// Deliberately minimal / privacy-conscious: no names, emails, IP addresses,
// or anything identifying a specific person is stored here.
const analyticsEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      enum: ["page_view", "project_view", "resume_download"],
      required: true,
      index: true,
    },
    page: { type: String, trim: true }, // e.g. "home", "projects", "contact"
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    // A random, non-identifying per-browser-session token, ONLY used to avoid
    // double-counting the same visitor's page load in "today/this week"
    // totals. Not linked to any personal data and not stored anywhere else.
    sessionId: { type: String, trim: true },
  },
  { timestamps: { createdAt: "timestamp", updatedAt: false } }
);

analyticsEventSchema.index({ eventType: 1, timestamp: -1 });

module.exports = mongoose.model("AnalyticsEvent", analyticsEventSchema);
