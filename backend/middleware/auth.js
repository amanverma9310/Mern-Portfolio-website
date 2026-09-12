const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// Reads the JWT from the httpOnly cookie (set on login) or, as a fallback,
// from an Authorization: Bearer header — verifies it and attaches the admin
// user to req.admin. Never trusts a client-supplied user id.
const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized. Please log in.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await User.findById(decoded.id).select("-passwordHash");

    if (!admin) {
      res.status(401);
      throw new Error("Not authorized. Admin account no longer exists.");
    }

    req.admin = admin;
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized. Invalid or expired session.");
  }
});

module.exports = { protect };
