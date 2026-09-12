import { useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
import { api, ApiError } from "../services/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      await api.post("/contact", form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof ApiError ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <section id="contact" className="relative py-20 sm:py-28 md:py-36 border-b border-white/10">
      <div className="max-w-5xl mx-auto px-5 sm:px-6 md:px-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-xs font-semibold tracking-widest text-white/40 mb-4">
            CONTACT
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white/90 mb-4 sm:mb-5">
            Let's Work Together
          </h2>
          <p className="text-white/50 text-sm sm:text-base max-w-xl mx-auto mb-12 sm:mb-16">
            Open for internships, collaborations, and freelance work. If you
            have something interesting, let's connect.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12 text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center"
          >
            <p className="text-white/60 leading-relaxed mb-8">
              Whether you're building a product, need a developer, or just
              want to say hi — I'm always open to meaningful conversations.
            </p>
              {/* SOCIAL LINKS */}
            <div className="flex items-center gap-3">

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
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-xs text-white/50 mb-2">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                maxLength={100}
                className="w-full bg-transparent border-b border-white/15 focus:border-white/50 outline-none py-2 text-sm text-white placeholder-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="w-full bg-transparent border-b border-white/15 focus:border-white/50 outline-none py-2 text-sm text-white placeholder-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-2">Subject</label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                required
                maxLength={150}
                className="w-full bg-transparent border-b border-white/15 focus:border-white/50 outline-none py-2 text-sm text-white placeholder-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-2">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Write your message..."
                required
                minLength={10}
                maxLength={5000}
                rows={3}
                className="w-full bg-transparent border-b border-white/15 focus:border-white/50 outline-none py-2 text-sm text-white placeholder-white/30 transition-colors resize-none"
              />
            </div>

            {status === "error" && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-white text-black font-semibold text-sm py-3 hover:bg-white/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "sending"
                ? "Sending..."
                : status === "sent"
                ? "Message Sent ✓"
                : "Send Message"}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
