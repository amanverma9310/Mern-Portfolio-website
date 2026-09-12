const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Contact = require("../models/Contact");
const Settings = require("../models/Settings");
const { sendContactNotification } = require("../utils/sendEmail");

// @route  POST /api/contact
// @access Public
const createContact = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { name, email, subject, message } = req.body;

  // Contact form must succeed and save to MongoDB even if email sending
  // fails or isn't configured — so the DB write happens first, on its own.
  const contact = await Contact.create({
    name,
    email,
    subject,
    message,
    ip: req.ip,
  });

  // Fire-and-forget: don't let a slow/broken email provider delay or fail
  // the visitor's response. Respects the admin's "email me on new message"
  // toggle in Settings (defaults to on if no settings doc exists yet).
  Settings.findOne()
    .then((settings) => {
      if (!settings || settings.emailNotificationsEnabled) {
        return sendContactNotification(contact);
      }
    })
    .catch(() => {});

  res.status(201).json({
    success: true,
    message: "Message sent successfully.",
    data: { id: contact._id },
  });
});

// @route  GET /api/contact
// @access Private (admin)
const getContacts = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query;

  const query = {};
  if (status && status !== "All") {
    query.status = status;
  }
  if (search) {
    query.$text = { $search: search };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  const [contacts, total] = await Promise.all([
    Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Contact.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: contacts,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  });
});

// @route  GET /api/contact/:id
// @access Private (admin)
const getContactById = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, data: contact });
});

// @route  PATCH /api/contact/:id
// @access Private (admin)
const updateContactStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowed = ["New", "Read", "Replied", "Archived"];

  if (!allowed.includes(status)) {
    res.status(400);
    throw new Error(`Status must be one of: ${allowed.join(", ")}`);
  }

  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!contact) {
    res.status(404);
    throw new Error("Message not found");
  }

  res.json({ success: true, data: contact });
});

// @route  DELETE /api/contact/:id
// @access Private (admin)
const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ success: true, message: "Message deleted" });
});

module.exports = {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
};
