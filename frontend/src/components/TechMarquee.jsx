import { useEffect, useState } from "react";
import { marqueeSkills as staticMarqueeSkills } from "../data/skills";
import { api } from "../services/api";
import { getIcon } from "../utils/iconMap";

export default function TechMarquee() {
  const [skills, setSkills] = useState(staticMarqueeSkills);

  useEffect(() => {
    let mounted = true;
    api
      .get("/skills")
      .then((res) => {
        if (!mounted) return;
        const marqueeSkills = res.data.filter((s) => s.sections.includes("marquee"));
        if (marqueeSkills.length) setSkills(marqueeSkills);
      })
      .catch(() => {
        // Backend unreachable — keep the original hardcoded skill list.
      });
    return () => {
      mounted = false;
    };
  }, []);

  const items = [...skills, ...skills];

  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 bg-[#0a0b0d] py-8">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#0a0b0d] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#0a0b0d] to-transparent z-10" />

      <div className="flex w-max animate-marquee">
        {items.map((skill, i) => {
          // Static fallback data already has an `Icon` component; DB-driven
          // data has an `iconKey` string that needs mapping.
          const Icon = skill.Icon || getIcon(skill.iconKey);
          return (
            <div
              key={`${skill.name}-${i}`}
              className="flex flex-col items-center gap-2 px-8"
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center border border-white/10"
                style={{ backgroundColor: skill.bg || "#0f1114" }}
              >
                <Icon size={24} color={skill.color} />
              </div>
              <span className="text-xs text-white/50">{skill.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
