const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// There is intentionally no public registration route anywhere in this API.
// The only way a document ever lands in this collection is via `npm run seed`
// (backend/seed.js), which reads ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD
// from environment variables.
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.statics.hashPassword = function (plainPassword) {
  return bcrypt.hash(plainPassword, 12);
};

module.exports = mongoose.model("User", userSchema);
