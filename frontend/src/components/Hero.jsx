import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiDownload } from "react-icons/fi";
import Terminal from "./Terminal";
import heroVideo from "../assets/hero.mp4";
import heroPoster from "../assets/hero-poster.jpg";
import { api } from "../services/api";
import { trackResumeDownload } from "../utils/analytics";

// Real aspect ratio of the source video after removing its baked-in
// letterbox bars (1280x1024, see crop step). Keeping this in sync with the
// actual asset is what lets the position math below stay accurate.
const SOURCE_ASPECT = 1280 / 1024;

/**
 * Figures out the ideal CSS object-position for the hero video given the
 * current container size, so the subject's face/hair never gets cropped out
 * regardless of how wide/tall/short the viewport is.
 *
 * - Wide & short containers (large desktop monitors, landscape tablets):
 *   object-cover scales by width, so extra height gets cropped. We bias the
 *   vertical anchor toward the top (lower %) so hair/forehead survive instead
 *   of getting cut off in favor of empty chest/shoulder space.
 * - Tall & narrow containers (phones): object-cover scales by height, so
 *   extra width gets cropped instead — vertical position barely matters, but
 *   we nudge the horizontal anchor to match where the subject actually sits
 *   in frame (slightly left of dead-center).
 */
function computeObjectPosition(width, height) {
  if (!width || !height) return "50% 30%";

  const containerAspect = width / height;

  if (containerAspect >= SOURCE_ASPECT) {
    const ratio = containerAspect / SOURCE_ASPECT;
    const posY = Math.max(8, Math.min(34, 34 - (ratio - 1) * 22));
    return `50% ${posY}%`;
  }

  return "46% 30%";
}

export default function Hero() {
  const videoWrapRef = useRef(null);
  const videoRef = useRef(null);
  const [objectPosition, setObjectPosition] = useState("50% 30%");
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    let mounted = true;
    api
      .get("/settings")
      .then((res) => mounted && setResumeUrl(res.data?.resumeUrl || ""))
      .catch(() => {
        // Backend unreachable / resume not configured yet — button stays hidden.
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleResumeClick = () => {
    trackResumeDownload();
  };

  // Recompute the crop anchor live as the viewport changes size/orientation.
  useEffect(() => {
    const el = videoWrapRef.current;
    if (!el) return;

    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setObjectPosition(computeObjectPosition(width, height));
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("orientationchange", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  // Respect prefers-reduced-motion: keep the poster frame static instead of
  // autoplaying a looping video for people who've asked for less motion.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotionPref = () => {
      if (mq.matches) {
        video.pause();
        video.currentTime = 0;
      } else {
        video.play().catch(() => {
          /* autoplay can be blocked by the browser; poster image covers this */
        });
      }
    };

    applyMotionPref();
    mq.addEventListener("change", applyMotionPref);
    return () => mq.removeEventListener("change", applyMotionPref);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen w-full flex items-center overflow-hidden pt-28 sm:pt-32 md:pt-28 lg:pt-24 pb-20 sm:pb-24"
    >
      {/* ================= BACKGROUND VIDEO ================= */}
      <div
        ref={videoWrapRef}
        className="absolute inset-0 w-full h-full overflow-hidden bg-black"
      >
        <video
          ref={videoRef}
          src={heroVideo}
          poster={heroPoster}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          style={{ objectPosition }}
          className="absolute inset-0 w-full h-full object-cover transition-[object-position] duration-300 ease-out"
        />

        {/* Dark overlay for text legibility */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg/30" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-5 sm:px-6 md:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-center">
        {/* ================= LEFT CONTENT ================= */}
        <div className="w-full">
          {/* Available Badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] tracking-wide text-emerald-300 font-medium">
              Available for work
            </span>
          </motion.div>

          {/* ================= HEADING ================= */}
          <h1 className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl leading-[1] font-extrabold tracking-tight mb-5 md:mb-6">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="block text-white"
            >
              Learning.
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="block bg-gradient-to-r from-accent-pink to-accent-orange bg-clip-text text-transparent"
            >
              Building.
            </motion.span>

            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="block text-white"
            >
              Improving.
            </motion.span>
          </h1>

          {/* ================= DESCRIPTION ================= */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-white/70 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mb-7 md:mb-8"
          >
            I'm Aman Verma, a BCA student from JB Knowledge Park, passionate
            about building real-world applications using full-stack
            development and AI. I focus on practical learning and
            problem-solving, with the goal of becoming a software engineer
            who builds impactful solutions — not just talks about them.
          </motion.p>

          {/* ================= BUTTONS ================= */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <button
              onClick={() => scrollTo("projects")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
            >
              See My Projects
              <span aria-hidden>→</span>
            </button>

            <button
              onClick={() => scrollTo("contact")}
              className="rounded-lg bg-[#3d7bff] px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-semibold text-white hover:bg-[#2f68e6] transition-colors"
            >
              Let's Talk
            </button>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleResumeClick}
                className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                <FiDownload size={14} />
                Resume
              </a>
            )}
          </motion.div>
        </div>

        {/* ================= TERMINAL ================= */}
        <div className="w-full mt-2 sm:mt-4 lg:mt-0 flex justify-center lg:justify-end">
          <div className="w-full max-w-xl">
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
}
