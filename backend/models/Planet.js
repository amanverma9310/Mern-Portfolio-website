const mongoose = require("mongoose");

// Backs the existing "Journey" orbiting-planets timeline (src/components/Journey.jsx).
// This is the closest real equivalent to a work/education "experience" list in
// this portfolio's actual design, so it's used for that purpose instead of a
// generic experience table that wouldn't render anywhere.
const planetSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true, maxlength: 100 },
    detail: { type: String, required: true, trim: true, maxlength: 400 },
    color: { type: String, required: true, default: "#3d7bff" },
    size: { type: Number, required: true, default: 12, min: 4, max: 40 },
    orbitRadius: { type: Number, required: true, min: 40, max: 400 },
    orbitDuration: { type: Number, required: true, min: 4, max: 120 },
    startAngle: { type: Number, required: true, default: 0, min: 0, max: 360 },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Planet", planetSchema);
