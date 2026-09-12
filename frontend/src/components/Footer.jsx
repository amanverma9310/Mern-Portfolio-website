import { useEffect, useState } from "react";
import { FiGithub, FiLinkedin, FiMail, FiArrowUp } from "react-icons/fi";

const TAGLINE = "Building modern web experiences...";

export default function Footer() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(TAGLINE.slice(0, i));
      if (i >= TAGLINE.length) clearInterval(id);
    }, 45);
    return () => clearInterval(id);
  }, []);

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h3 className="text-2xl md:text-3xl font-bold text-white/90 mb-3">
          Aman verma
        </h3>
        <p className="text-white/50 text-sm mb-8 font-mono h-5">
          {typed}
          <span className="inline-block w-px h-4 bg-white/60 ml-0.5 animate-blink align-middle" />
        </p>

        <div className="flex items-center justify-center gap-3 mb-8">

              {/* GITHUB */}
              <a
                href="https://github.com/amanverma9310"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-colors"
              >
                <FiGithub size={17} />
              </a>

              {/* LINKEDIN */}
              <a
                href="https://www.linkedin.com/in/aman-verma-8788043aa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-colors"
              >
                <FiLinkedin size={17} />
              </a>

              {/* EMAIL */}
              <a
                href="mailto:amanverma9310@gmail.com"
                aria-label="Email"
                className="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 transition-colors"
              >
                <FiMail size={17} />
              </a>

          
        </div>

        <button
          onClick={scrollTop}
          className="inline-flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors mb-10"
        >
          <FiArrowUp size={13} /> Back to top
        </button>

        <div className="flex items-center gap-4 mb-8">
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-[11px] text-white/35">crafted with passion</span>
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <p className="text-[11px] text-white/30">
          © 2026 V8 Aman. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
