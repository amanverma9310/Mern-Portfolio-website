const mongoose = require("mongoose");

// The frontend keeps a fixed map of iconKey -> react-icons component
// (see src/utils/iconMap.js), so this model stores a *key*, not a component.
const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    iconKey: { type: String, required: true, trim: true }, // e.g. "SiReact"
    color: { type: String, default: "#ffffff" },
    bg: { type: String }, // optional background used by the TechMarquee tiles
    // Which existing sections this skill should render in.
    sections: {
      type: [String],
      enum: ["marquee", "arsenal"],
      default: ["arsenal"],
    },
    order: { type: Number, default: 0, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
