const express = require("express");
const { body } = require("express-validator");
const {
  createContact,
  getContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} = require("../controllers/contactController");
const { protect } = require("../middleware/auth");
const { contactLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

const contactValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("A valid email is required").normalizeEmail(),
  body("subject").trim().notEmpty().withMessage("Subject is required").isLength({ max: 150 }),
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters"),
];

// Public
router.post("/", contactLimiter, contactValidation, createContact);

// Admin-only
router.get("/", protect, getContacts);
router.get("/:id", protect, getContactById);
router.patch("/:id", protect, updateContactStatus);
router.delete("/:id", protect, deleteContact);

module.exports = router;
