import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { planets as staticPlanets } from "../data/journey";
import { api } from "../services/api";

function Stars({ count = 140 }) {
  const stars = useRef(
    Array.from({ length: count }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: Math.random() < 0.85 ? 1 : 2,
      opacity: 0.3 + Math.random() * 0.6,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: s.size,
            height: s.size,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

export default function Journey() {
  const [planets, setPlanets] = useState(
    staticPlanets.map((p) => ({ ...p, id: p.id }))
  );
  const [angles, setAngles] = useState(() =>
    Object.fromEntries(staticPlanets.map((p) => [p.id, p.startAngle]))
  );
  const [hovered, setHovered] = useState(null);
  const [paused, setPaused] = useState(false);
  const rafRef = useRef();
  const lastRef = useRef(performance.now());

  useEffect(() => {
    let mounted = true;
    api
      .get("/planets")
      .then((res) => {
        if (!mounted || !res.data?.length) return;
        // DB documents use `_id` — normalize to the `id` key the rest of
        // this component (and the angle-tracking state) already expects.
        const dbPlanets = res.data.map((p) => ({ ...p, id: p._id }));
        setPlanets(dbPlanets);
        setAngles(Object.fromEntries(dbPlanets.map((p) => [p.id, p.startAngle])));
      })
      .catch(() => {
        // Backend unreachable — keep the original hardcoded journey.
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const tick = (now) => {
      const dt = (now - lastRef.current) / 1000;
      lastRef.current = now;
      if (!paused) {
        setAngles((prev) => {
          const next = { ...prev };
          for (const p of planets) {
            const speed = 360 / p.orbitDuration; // deg/sec
            next[p.id] = (prev[p.id] + speed * dt) % 360;
          }
          return next;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, planets]);

  return (
    <section
      id="journey"
      className="relative py-20 sm:py-28 md:py-36 border-b border-white/10 bg-black overflow-hidden"
    >
      <Stars />

      <div className="relative z-10 flex justify-center mb-10 sm:mb-16 px-5 sm:px-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 sm:px-5 py-2 sm:py-2.5 text-[11px] sm:text-sm text-white/70 font-mono tracking-wide text-center">
          EXPLORE MY JOURNEY 🚀 — HOVER ON PLANETS TO DISCOVER MY EXPERIENCE &amp; PROJECTS
        </div>
      </div>

      <div
        className="relative z-10 mx-auto flex items-center justify-center overflow-visible h-[360px] sm:h-[490px] md:h-[615px] lg:h-[720px]"
      >
        <div
          className="absolute origin-center scale-[0.5] sm:scale-[0.68] md:scale-[0.85] lg:scale-100 transition-transform"
          style={{ width: 720, height: 720 }}
        >
        <div className="absolute inset-0 flex items-center justify-center">
          {/* orbit rings */}
          {planets.map((p) => (
            <div
              key={`ring-${p.id}`}
              className="absolute rounded-full border border-white/10"
              style={{
                width: p.orbitRadius * 2,
                height: p.orbitRadius * 2,
              }}
            />
          ))}

          {/* sun */}
          <div className="absolute w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-amber-500 shadow-[0_0_60px_20px_rgba(251,191,36,0.35)] flex items-center justify-center">
            <span className="text-[11px] font-bold tracking-widest text-black/70">
              AMAN
            </span>
          </div>

          {/* planets */}
          {planets.map((p) => {
            const rad = (angles[p.id] * Math.PI) / 180;
            const x = Math.cos(rad) * p.orbitRadius;
            const y = Math.sin(rad) * p.orbitRadius;
            const isHovered = hovered === p.id;

            return (
              <div
                key={p.id}
                className="absolute"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                <motion.button
                  onMouseEnter={() => {
                    setHovered(p.id);
                    setPaused(true);
                  }}
                  onMouseLeave={() => {
                    setHovered(null);
                    setPaused(false);
                  }}
                  onClick={() => {
                    setHovered((h) => (h === p.id ? null : p.id));
                    setPaused((prev) => (hovered === p.id ? false : true));
                  }}
                  whileHover={{ scale: 1.4 }}
                  className="rounded-full cursor-pointer"
                  style={{
                    width: p.size * 2,
                    height: p.size * 2,
                    backgroundColor: p.color,
                    boxShadow: isHovered
                      ? `0 0 24px 6px ${p.color}88`
                      : `0 0 10px 2px ${p.color}55`,
                  }}
                  aria-label={p.label}
                />

                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 top-6 z-20 w-64 rounded-xl border border-white/15 bg-[#0c0d10]/95 backdrop-blur-md p-4 shadow-2xl"
                    >
                      <div className="text-sm font-semibold text-white mb-1">
                        {p.label}
                      </div>
                      <div className="text-xs text-white/60 leading-relaxed">
                        {p.detail}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
        </div>
      </div>
      <p className="relative z-10 text-center text-[11px] text-white/30 mt-6 md:hidden">
        Tap a planet to see details
      </p>
    </section>
  );
}
