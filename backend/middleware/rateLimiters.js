const rateLimit = require("express-rate-limit");

// Prevents brute-forcing the admin login form.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later." },
});

// Basic spam/abuse protection for the public contact form.
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many messages sent from this device. Please try again later.",
  },
});

// Loose limiter for analytics beacons so a script can't spam the DB.
const analyticsLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests." },
});

module.exports = { loginLimiter, contactLimiter, analyticsLimiter };
