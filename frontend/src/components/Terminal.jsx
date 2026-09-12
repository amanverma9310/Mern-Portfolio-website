import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const COMMANDS = {
  help: () => [
    "Available commands:",
    "  about       - who is Aman?",
    "  skills      - tech I work with",
    "  projects    - things I've built",
    "  contact     - how to reach me",
    "  clear       - clear the terminal",
  ],
  about: () => [
    "Aman verma — BCA student @ JB Knowledge Park.",
    "Focused on full-stack development and applied AI.",
    "Learning in public, shipping real projects.",
  ],
  skills: () => [
    "React.js, JavaScript, Node.js, MongoDB,",
    "Tailwind CSS, Framer Motion, Firebase, Git.",
  ],
  projects: () => [
    "1. Fork Dash  : Food website",
    "2. Metallic Crafts - Metallic crafts E-commerce ",
    "Type 'contact' to talk about a project.",
  ],
  contact: () => [
    "Email  → hello@amanverma",
    "GitHub → github.com/amanverma",
    "LinkedIn → linkedin.com/in/amanverma",
  ],
};

export default function Terminal() {
  const [lines, setLines] = useState([
    "Welcome to Aman's Terminal 🚀",
    "Type 'help' to see commands",
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [histIndex, setHistIndex] = useState(-1);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [lines]);

  const runCommand = (raw) => {
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    setHistory((h) => [...h, cmd]);
    setHistIndex(-1);

    if (cmd === "clear") {
      setLines([]);
      return;
    }

    const handler = COMMANDS[cmd];
    setLines((prev) => [
      ...prev,
      `$ ${raw}`,
      ...(handler ? handler() : [`command not found: ${cmd}`, "type 'help' for a list of commands"]),
    ]);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      runCommand(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = histIndex < 0 ? history.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(nextIndex);
      setValue(history[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex < 0) return;
      const nextIndex = histIndex + 1;
      if (nextIndex >= history.length) {
        setHistIndex(-1);
        setValue("");
      } else {
        setHistIndex(nextIndex);
        setValue(history[nextIndex]);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
     className="w-full md:translate-x-8 rounded-xl overflow-hidden border border-white/10 bg-[#0b0c0f]/90 backdrop-blur-md shadow-2xl"

    >
      <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/10 bg-white/[0.03]">
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f57]" />
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#febc2e]" />
        <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[11px] sm:text-xs text-white/50 font-mono truncate">terminal — aman.dev</span>
      </div>

      <div
        ref={bodyRef}
        className="h-52 sm:h-64 md:h-72 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 font-mono text-[12px] sm:text-[13px] leading-relaxed text-white/70 space-y-1"
      >
        {lines.map((line, i) => (
          <div key={i} className={line.startsWith("$") ? "text-white break-words" : "break-words"}>
            {line}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 px-3 sm:px-4 py-2.5 sm:py-3">
        <span className="text-accent-blue font-mono text-sm">$</span>
        <input
          id="terminal-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="type a command..."
          spellCheck={false}
          className="flex-1 min-w-0 bg-transparent outline-none font-mono text-sm text-white placeholder-white/30"
        />
        <span className="w-1.5 h-4 bg-white/70 animate-blink" />
      </div>
    </motion.div>
  );
}
