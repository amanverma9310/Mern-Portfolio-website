const jwt = require("jsonwebtoken");

function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// Sets the JWT as an httpOnly cookie so it's never reachable from
// frontend JS (protects against XSS token theft).
function setTokenCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProd, // HTTPS only in production
    sameSite: isProd ? "none" : "lax", // "none" needed for cross-site prod (Vercel <-> Render)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  });
}

function clearTokenCookie(res) {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
}

module.exports = { generateToken, setTokenCookie, clearTokenCookie };
