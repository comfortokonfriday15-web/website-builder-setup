import { motion } from "motion/react";
import { useCountUp } from "../hooks/useCountUp";
import { fadeUpBlur, staggerContainer, staggerItem } from "../lib/animations";

const testimonials = [
  {
    quote: "FlowBoard reduced our project delays by 37% in the first quarter. The AI-powered context linking alone saved us hours every week.",
    metric: 37,
    metricLabel: "reduction in project delays",
    author: "Marcus Rivera",
    role: "VP of Engineering",
    company: "ScalePath",
    initials: "MR",
  },
  {
    quote: "We cut onboarding time in half. New hires go from zero to shipping on day three instead of week three. The workspace is that intuitive.",
    metric: 50,
    metricLabel: "faster onboarding",
    author: "Priya Sharma",
    role: "Director of Product",
    company: "Nexus Technologies",
    initials: "PS",
  },
  {
    quote: "For the first time, I have complete visibility into what every team is working on. FlowBoard is the single source of truth we always needed.",
    metric: 100,
    metricLabel: "team visibility",
    author: "James Chen",
    role: "CTO",
    company: "Orbital Systems",
    initials: "JC",
  },
];

function MetricCount({ target, label }: { target: number; label: string }) {
  const { ref, display } = useCountUp(target, { duration: 2.5, delay: 0.3 });
  return (
    <div className="mb-4 inline-flex items-center gap-2 self-start rounded-full bg-primary/10 px-3.5 py-1.5 border border-primary/10">
      <span className="text-[18px] font-bold tracking-[-0.03em] text-primary">
        <span ref={ref}><motion.span>{display}</motion.span>%</span>
      </span>
      <span className="text-[10px] text-ink-muted font-medium">{label}</span>
    </div>
  );
}

export default function SocialProof() {
  return (
    <section className="section-gradient py-28 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1 text-[11px] font-medium tracking-[0.15em] text-primary uppercase backdrop-blur-sm">
            Social Proof
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            Trusted By High-Performing Teams
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Companies of every size use FlowBoard to ship faster and stay aligned.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-6 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.author}
              variants={staggerItem}
              className="card-premium group relative flex flex-col rounded-2xl p-7 transition-all duration-500 hover:-translate-y-1"
            >
              <MetricCount target={t.metric} label={t.metricLabel} />

              <blockquote className="flex-1">
                <p className="text-[13px] leading-relaxed text-ink-muted/90 italic">&ldquo;{t.quote}&rdquo;</p>
              </blockquote>

              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-white/[0.06]">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-violet-500/20 text-xs font-semibold text-primary border border-primary/10"
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="mt-16"
        >
          <p className="mb-8 text-center text-[12px] font-medium tracking-[0.12em] text-ink-subtle uppercase">
            Trusted by engineering teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {["Vercel", "Linear", "Raycast", "Supabase", "Cal.com", "WorkOS"].map((name) => (
              <div key={name} className="flex items-center gap-2 opacity-40 transition-all duration-500 hover:opacity-70 hover:scale-105 cursor-default">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-[9px] font-bold text-ink-muted transition-colors duration-300">
                  {name.charAt(0)}
                </div>
                <span className="text-[13px] font-medium text-ink-muted">{name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
