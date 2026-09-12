const mongoose = require("mongoose");

// Singleton document — there is only ever one Settings row (enforced in the
// controller via findOneAndUpdate(..., { upsert: true })).
const settingsSchema = new mongoose.Schema(
  {
    ownerName: { type: String, default: "Aman Verma" },
    contactEmail: { type: String, default: "amanverma9310@gmail.com" },
    socialLinks: {
      github: { type: String, default: "https://github.com/amanverma9310" },
      linkedin: {
        type: String,
        default: "https://www.linkedin.com/in/aman-verma-8788043aa",
      },
      twitter: { type: String, default: "" },
    },
    resumeUrl: { type: String, default: "" },
    emailNotificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
