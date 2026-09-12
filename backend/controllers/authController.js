const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const { generateToken, setTokenCookie, clearTokenCookie } = require("../utils/generateToken");

// @route  POST /api/auth/login
// @access Public (rate-limited)
const login = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  const { username, password } = req.body;

  // Same generic error whether the username doesn't exist or the password
  // is wrong, so login attempts can't be used to enumerate valid usernames.
  const genericError = () => {
    res.status(401);
    throw new Error("Invalid username or password");
  };

  const admin = await User.findOne({ username: username.toLowerCase().trim() });
  if (!admin) return genericError();

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) return genericError();

  const token = generateToken(admin._id);
  setTokenCookie(res, token);

  res.json({
    success: true,
    admin: { id: admin._id, username: admin.username, email: admin.email },
  });
});

// @route  POST /api/auth/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
  clearTokenCookie(res);
  res.json({ success: true, message: "Logged out" });
});

// @route  GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});

module.exports = { login, logout, getMe };
