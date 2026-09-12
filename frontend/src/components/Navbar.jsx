import { useState } from "react";
import { motion } from "framer-motion";
import { FiMoon, FiSun, FiMenu, FiX } from "react-icons/fi";

const navItems = [
  { label: "Journey", id: "journey" },
  { label: "Certifications", id: "certifications" },
  { label: "Project", id: "projects" },
  { label: "Contact", id: "contact" },
];

export default function Navbar({ dark, setDark }) {
  const [open, setOpen] = useState(false);

  const scrollTo = (id) => {
    setOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-40">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-6 md:px-10 py-5 md:py-6">
        <a href="#home" className="flex items-baseline gap-1 min-w-0">
          <span className="text-base sm:text-lg md:text-xl font-bold tracking-tight text-white truncate">
            Aman Verma
          </span>
          <span className="text-white/40 text-base sm:text-lg shrink-0">...</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle theme"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 flex items-center justify-center text-white/80 hover:text-white hover:border-white/30 transition-colors"
          >
            {dark ? <FiMoon size={14} /> : <FiSun size={14} />}
          </button>
          <button
            className="md:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-white/15 flex items-center justify-center text-white/80"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <FiX size={16} /> : <FiMenu size={16} />}
          </button>
        </div>
      </nav>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden mx-5 sm:mx-6 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-4 flex flex-col gap-1"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left text-sm text-white/80 hover:text-white py-2.5 border-b border-white/5 last:border-b-0"
            >
              {item.label}
            </button>
          ))}
        </motion.div>
      )}
    </header>
  );
}
