const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    tags: { type: [String], default: [] }, // technologies, e.g. "React.js"
    features: { type: [String], default: [] },
    // URL to an image (uploaded elsewhere / hosted) — matches the existing
    // ProjectCard.jsx <img src={project.image} /> usage.
    image: { type: String, required: true },
    liveUrl: { type: String, trim: true },
    codeUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false, index: true },
    order: { type: Number, default: 0, index: true },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
