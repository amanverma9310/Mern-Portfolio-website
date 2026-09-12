import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { arsenal as staticArsenal } from "../data/skills";
import { api } from "../services/api";
import { getIcon } from "../utils/iconMap";

export default function Manifesto() {
  const [arsenal, setArsenal] = useState(staticArsenal);

  useEffect(() => {
    let mounted = true;
    api
      .get("/skills")
      .then((res) => {
        if (!mounted) return;
        const arsenalSkills = res.data
          .filter((s) => s.sections.includes("arsenal"))
          .map((s) => ({ name: s.name, Icon: getIcon(s.iconKey), color: s.color }));
        if (arsenalSkills.length) setArsenal(arsenalSkills);
      })
      .catch(() => {
        // Backend unreachable — keep the original hardcoded arsenal list.
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="about" className="relative py-20 sm:py-28 md:py-36 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-10">
        {/* document meta header */}
        <div className="flex items-start justify-between gap-4 text-[9px] sm:text-[11px] font-mono tracking-widest text-white/40 mb-10 sm:mb-16">
          <div>
            <div>DOCUMENT // 01</div>
            <div>PROFILE_MANIFESTO</div>
          </div>
          <div className="text-right">
            <div>STATUS: ACTIVELY BUILDING</div>
            <div>LOCATION: EARTH</div>
          </div>
        </div>

        {/* big headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="font-extrabold leading-[0.95] tracking-tight mb-12 sm:mb-16 md:mb-20"
        >
          <span className="block text-[15vw] sm:text-[13vw] md:text-[7rem] lg:text-[8rem] text-white">
            NOT JUST
          </span>
          <span className="block text-[15vw] sm:text-[13vw] md:text-[7rem] lg:text-[8rem] text-outline">
            A CODER.
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-[280px_1fr] gap-8 md:gap-12">
          {/* arsenal */}
          <div>
            <div className="text-xs font-mono tracking-widest text-white/40 mb-4 sm:mb-5">
              ARSENAL
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-2.5">
              {arsenal.map(({ name, Icon, color }) => (
                <span
                  key={name}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs text-white/80"
                >
                  <Icon size={13} color={color} />
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* paragraph */}
          <p className="text-xl sm:text-2xl md:text-3xl leading-snug text-white/85 max-w-3xl">
            I'm a BCA student obsessed with turning logic into impactful
            digital experiences. My journey started with curiosity and
            turned into a discipline of building real-world solutions —
            one project, one bug, one deploy at a time.
          </p>
        </div>
      </div>
    </section>
  );
}
