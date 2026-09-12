import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";

const certifications = [
  { title: "Full-Stack Web Development", issuer: "TECHNGLOBAL" },
  { title: "Advanced JavaScript Algorithms & Data Structures", issuer: "Learntube" },
  { title: "React.js ", issuer: "Learntube" },
];

export default function Certifications() {
  return (
    <section id="certifications" className="relative py-28 md:py-36 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <div className="text-xs font-semibold tracking-widest text-white/40 mb-3">
            CREDENTIALS
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Certifications
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5">
          {certifications.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-6"
            >
              <FiAward className="text-amber-400 mb-4" size={22} />
              <h3 className="text-white font-semibold mb-1">{c.title}</h3>
              <p className="text-white/45 text-sm">{c.issuer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
