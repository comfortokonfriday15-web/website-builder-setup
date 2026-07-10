import { motion } from "motion/react";
import { fadeUpBlur, staggerContainer, staggerItem } from "../lib/animations";

const testimonials = [
  {
    quote: "FlowBoard completely changed how our team ships products. Context-switching used to eat 40% of our week. Now everything lives in one place.",
    author: "Sarah Chen",
    role: "Engineering Lead",
    company: "Amplify Studios",
    initials: "SC",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    quote: "We evaluated five platforms before FlowBoard. None of them connected documentation, tasks, and AI the way this does. It's a category-defining product.",
    author: "David Okonkwo",
    role: "CTO",
    company: "Bridge Technologies",
    initials: "DO",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    quote: "The AI assistant alone saves me two hours a day. It surfaces context I didn't even know I needed. This is how software should work.",
    author: "Emily Larsson",
    role: "Senior Product Manager",
    company: "NovaCorp",
    initials: "EL",
    gradient: "from-amber-500 to-orange-600",
  },
];

export default function Testimonials() {
  return (
    <section className="section-gradient-alt py-24 md:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1 text-[11px] font-medium tracking-[0.15em] text-primary uppercase backdrop-blur-sm">
            Testimonials
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            What Teams Are Saying
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Real feedback from teams who made the switch.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.author}
              variants={staggerItem}
              className="card-premium group relative flex flex-col rounded-2xl p-7 transition-all duration-500 hover:-translate-y-1"
            >
              <motion.div
                className="flex gap-1 mb-5"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {[...Array(5)].map((_, s) => (
                  <motion.svg
                    key={s}
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 2, delay: s * 0.15, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <path d="M7 0L9.05 4.95L14 5.5L10.5 9.25L11.5 14L7 11.5L2.5 14L3.5 9.25L0 5.5L4.95 4.95L7 0Z" fill="#7C83FF" opacity={0.6} />
                  </motion.svg>
                ))}
              </motion.div>

              <blockquote className="flex-1">
                <p className="text-[14px] leading-relaxed text-ink-muted/90">&ldquo;{t.quote}&rdquo;</p>
              </blockquote>

              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-white/[0.06]">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${t.gradient} text-xs font-semibold text-white border border-white/10`}
                >
                  {t.initials}
                </motion.div>
                <div>
                  <div className="text-[13px] font-medium text-ink">{t.author}</div>
                  <div className="text-[11px] text-ink-subtle">{t.role} — {t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
