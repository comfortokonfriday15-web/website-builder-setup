import { motion } from "motion/react";
import { fadeUpBlur } from "../lib/animations";

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0 hero-bg" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/[0.05] blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-violet-500/[0.04] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            variants={fadeUpBlur}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-block rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1 text-[11px] font-medium tracking-[0.15em] text-primary uppercase backdrop-blur-sm">
              Get Started
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-[clamp(2.25rem,5vw,4rem)] font-bold leading-[1.05] tracking-[-0.04em]"
          >
            <span className="text-ink">Stop Switching Context.</span>
            <br />
            <motion.span
              className="gradient-text inline-block"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              Start Shipping Faster.
            </motion.span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto mt-6 max-w-[560px] text-[16px] leading-relaxed text-ink-muted"
          >
            Bring your projects, conversations, and documentation together in one intelligent workspace. Join 20,000+ teams already shipping faster with FlowBoard.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-8 text-[15px] font-medium text-white transition-all duration-300 ease-[var(--ease-out)] hover:bg-primary-hover shadow-xl shadow-primary/20"
            >
              Start Free
              <motion.svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex h-14 items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-8 text-[15px] font-medium text-ink-muted transition-all duration-300 ease-[var(--ease-out)] hover:bg-white/[0.06] hover:text-ink backdrop-blur-sm"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 5.5V11M10 5.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Book Demo
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.45, ease: [0.23, 1, 0.32, 1] }}
            className="mt-10 flex items-center justify-center gap-6"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full border-2 border-canvas bg-gradient-to-br from-violet-400 to-violet-600" />
                <div className="h-6 w-6 rounded-full border-2 border-canvas bg-gradient-to-br from-emerald-400 to-emerald-600" />
                <div className="h-6 w-6 rounded-full border-2 border-canvas bg-gradient-to-br from-amber-400 to-amber-600" />
              </div>
              <span className="text-[13px] text-ink-subtle">
                <span className="font-medium text-ink">No credit card</span> required
              </span>
            </div>
            <div className="h-4 w-px bg-white/[0.08]" />
            <span className="text-[13px] text-ink-subtle">Free for up to 10 users</span>
            <div className="h-4 w-px bg-white/[0.08]" />
            <span className="text-[13px] text-ink-subtle">Cancel anytime</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
