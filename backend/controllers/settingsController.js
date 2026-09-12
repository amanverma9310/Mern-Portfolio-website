const asyncHandler = require("express-async-handler");
const Settings = require("../models/Settings");

async function getOrCreateSettings() {
  let settings = await Settings.findOne();
  if (!settings) {
    settings = await Settings.create({});
  }
  return settings;
}

// @route  GET /api/settings
// @access Public — only the fields the public site actually needs
const getPublicSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({
    success: true,
    data: {
      ownerName: settings.ownerName,
      contactEmail: settings.contactEmail,
      socialLinks: settings.socialLinks,
      resumeUrl: settings.resumeUrl,
    },
  });
});

// @route  GET /api/settings/admin
// @access Private (admin) — full settings document
const getAdminSettings = asyncHandler(async (req, res) => {
  const settings = await getOrCreateSettings();
  res.json({ success: true, data: settings });
});

// @route  PUT /api/settings
// @access Private (admin)
const updateSettings = asyncHandler(async (req, res) => {
  const settings = await Settings.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
    runValidators: true,
  });
  res.json({ success: true, data: settings });
});

module.exports = { getPublicSettings, getAdminSettings, updateSettings };
