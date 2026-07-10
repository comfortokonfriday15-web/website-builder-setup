import { motion } from "motion/react";
import { useCountUp } from "../hooks/useCountUp";
import { staggerContainer, staggerItem } from "../lib/animations";
import { useSpring, useMotionValue, useTransform } from "motion/react";
import { type MouseEvent, useCallback, useRef } from "react";

function StatCard({ value, label, desc }: { value: string; label: string; desc: string }) {
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  const isTime = value.includes("h");
  const isPlus = value.includes("+");
  const suffix = isTime ? "h" : isPlus ? "+" : "%";

  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [3, -3]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-3, 3]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }, [x, y]);

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      variants={staggerItem}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, perspective: 800 }}
      className="card-premium group rounded-2xl p-8 transition-all duration-500"
    >
      <motion.div className="text-[clamp(2.5rem,5vw,3.5rem)] font-bold tracking-[-0.04em] text-primary">
        {isTime || isPlus ? (
          <CountUpDisplay target={numericValue} suffix={suffix} decimal={isTime ? 1 : 0} />
        ) : (
          <CountUpDisplay target={numericValue} suffix="%" />
        )}
      </motion.div>
      <h3 className="mt-2 text-[15px] font-medium text-ink">{label}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{desc}</p>
      <div className="mt-4 h-[2px] w-12 rounded-full bg-primary/20 group-hover:w-full group-hover:bg-primary/40 transition-all duration-500 ease-[var(--ease-out)]" />
    </motion.div>
  );
}

function CountUpDisplay({ target, suffix, decimal = 0 }: { target: number; suffix: string; decimal?: number }) {
  const { ref, display } = useCountUp(target, { duration: 2, delay: 0.2, decimal });
  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

const stats = [
  { label: "Missed updates", value: "47%", desc: "of critical team updates get buried in chat threads" },
  { label: "Lost decisions", value: "62%", desc: "of product decisions are never documented" },
  { label: "Duplicate tasks", value: "3.2h", desc: "wasted per person weekly recreating lost work" },
  { label: "Fragmented knowledge", value: "12+", desc: "tools the average team switches between daily" },
];

export default function ProblemSection() {
  return (
    <section className="section-gradient py-28 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:sticky lg:top-32 lg:self-start"
          >
            <span className="inline-block rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1 text-[11px] font-medium tracking-[0.15em] text-primary uppercase backdrop-blur-sm">
              The Problem
            </span>
            <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
              Teams lose hours every week switching between tools.
            </h2>
            <p className="mt-5 max-w-[460px] text-[15px] leading-relaxed text-ink-muted">
              Projects, conversations, documentation, and decisions live in different places. Context gets lost. Teams waste time searching for information that should be at their fingertips.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
              <span className="text-[12px] font-medium text-ink-subtle tracking-wider uppercase">The cost adds up</span>
              <div className="h-px flex-1 bg-gradient-to-l from-primary/40 to-transparent" />
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {stats.map((s) => (
              <StatCard key={s.label} value={s.value} label={s.label} desc={s.desc} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
