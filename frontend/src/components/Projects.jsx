import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { projects as staticProjects } from "../data/projects";
import { api } from "../services/api";
import ProjectCard from "./ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState(null); // null = loading
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let mounted = true;
    api
      .get("/projects")
      .then((res) => {
        if (!mounted) return;
        if (res.data?.length) {
          setProjects(res.data);
        } else {
          // Backend reachable but empty — keep the portfolio looking complete.
          setProjects(staticProjects);
          setUsedFallback(true);
        }
      })
      .catch(() => {
        if (!mounted) return;
        // Backend unreachable (e.g. not deployed yet) — fall back to the
        // original hardcoded projects so the section never looks broken.
        setProjects(staticProjects);
        setUsedFallback(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="projects" className="relative py-20 sm:py-28 md:py-36 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 sm:mb-14"
        >
          <div className="text-xs font-semibold tracking-widest text-purple-400 mb-3">
            FEATURED WORK
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold">
            <span className="text-white">Recent </span>
            <span className="text-[#3d7bff]">Projects</span>
          </h2>
        </motion.div>

        <div className="space-y-6 sm:space-y-8">
          {projects === null ? (
            // Lightweight shimmer placeholders while the API responds.
            Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden grid md:grid-cols-2 animate-pulse"
              >
                <div className="min-h-[220px] sm:min-h-[280px] bg-white/[0.03]" />
                <div className="p-6 md:p-10 space-y-4">
                  <div className="h-6 w-2/3 bg-white/[0.05] rounded" />
                  <div className="h-4 w-full bg-white/[0.04] rounded" />
                  <div className="h-4 w-5/6 bg-white/[0.04] rounded" />
                </div>
              </div>
            ))
          ) : (
            projects.map((project, i) => (
              <ProjectCard
                key={project._id || project.id}
                project={project}
                reverse={i % 2 === 1}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}
