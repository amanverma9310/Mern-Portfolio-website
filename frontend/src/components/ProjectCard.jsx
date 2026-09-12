import { motion } from "framer-motion";
import { FiCode, FiExternalLink } from "react-icons/fi";
import { trackProjectView } from "../utils/analytics";

export default function ProjectCard({ project, reverse }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => trackProjectView(project._id)}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
      className={`rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden grid md:grid-cols-2 ${
        reverse ? "md:[&>*:first-child]:order-2" : ""
      }`}
    >
      {/* Project Image */}
      <div className="p-5 sm:p-6 md:p-8 flex items-center justify-center bg-gradient-to-br from-white/[0.04] to-transparent min-h-[220px] sm:min-h-[280px]">
      <div className="w-full h-full min-h-[220px] sm:min-h-[280px] overflow-hidden">
  <img
    src={project.image}
    alt={project.title}
    className="w-full h-full "
  />
</div>


      </div>

      {/* Project Information */}
      <div className="p-5 sm:p-6 md:p-10 flex flex-col justify-center">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3">
          {project.title}
        </h3>

        <p className="text-white/60 text-sm md:text-base leading-relaxed mb-5">
          {project.description}
        </p>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs text-white/75"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Features */}
        {project.features && (
          <div className="mb-6">
            <div className="text-xs font-semibold tracking-widest text-amber-400/90 mb-2.5">
              KEY FEATURES:
            </div>

            <ul className="space-y-1.5">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-white/70"
                >
                  <span className="mt-2 w-1 h-1 rounded-full bg-white/40 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-auto pt-2">
          <a
            href={project.codeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-white/80 hover:bg-white/5 transition-colors"
          >
            <FiCode size={13} />
            Code
          </a>

          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-white/90 transition-colors"
          >
            <FiExternalLink size={13} />
            Live Demo
          </a>
        </div>
      </div>
    </motion.div>
  );
}

