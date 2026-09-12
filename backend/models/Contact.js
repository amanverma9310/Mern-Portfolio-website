const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
    subject: { type: String, required: true, trim: true, maxlength: 150 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["New", "Read", "Replied", "Archived"],
      default: "New",
      index: true,
    },
    // stored only for basic abuse tracing, never displayed to the public
    ip: { type: String, select: false },
  },
  { timestamps: true }
);

contactSchema.index({ createdAt: -1 });
contactSchema.index({ name: "text", email: "text", subject: "text" });

module.exports = mongoose.model("Contact", contactSchema);
