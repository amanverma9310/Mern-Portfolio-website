import { motion } from "framer-motion";
import {
  FiHome,
  FiUser,
  FiCode,
  FiBriefcase,
  FiMail,
} from "react-icons/fi";

const links = [
  { id: "home", label: "Home", Icon: FiHome },
  { id: "about", label: "About", Icon: FiUser },
  { id: "projects", label: "Projects", Icon: FiCode },
  { id: "journey", label: "Journey", Icon: FiBriefcase },
  { id: "contact", label: "Contact", Icon: FiMail },
];

export default function FloatingDock() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.6,
        duration: 0.6,
        ease: "easeOut",
      }}
      className="fixed inset-x-0 bottom-4 sm:bottom-6 z-50 mx-auto w-max max-w-[94vw]"
    >
      <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-white/10 bg-black/60 backdrop-blur-xl px-2 sm:px-3 py-2 sm:py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        {links.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            aria-label={label}
            type="button"
            className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:h-10 sm:w-10"
          >
            {/* Mobile icon */}
            <Icon size={16} className="sm:hidden" />

            {/* Desktop icon */}
            <Icon size={17} className="hidden sm:block" />

            {/* Tooltip - desktop only */}
            <span className="pointer-events-none absolute -top-9 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-white/10 px-2 py-1 text-[11px] text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 sm:block">
              {label}
            </span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
