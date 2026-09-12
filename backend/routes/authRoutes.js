const express = require("express");
const { body } = require("express-validator");
const { login, logout, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rateLimiters");

const router = express.Router();

router.post(
  "/login",
  loginLimiter,
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  login
);

router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;
