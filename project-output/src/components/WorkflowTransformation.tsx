import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, MagnifyingGlass, LinkBreak, RocketLaunch } from "@phosphor-icons/react";
import { fadeUpBlur, staggerItem } from "../lib/animations";
import { gsap } from "../lib/gsap-register";

const steps = [
  {
    icon: MagnifyingGlass,
    title: "Information Scattered",
    desc: "Context lives across chat, email, docs, and project boards. Teams spend 30% of their week hunting for what they need.",
    color: "from-rose-400/20 to-rose-400/5",
    border: "border-rose-400/20",
    iconBg: "bg-rose-400/15",
    iconColor: "text-rose-400",
    barColor: "bg-rose-400",
  },
  {
    icon: LinkBreak,
    title: "Knowledge Connected",
    desc: "FlowBoard links every piece of context — decisions, discussions, code, and documentation — into a unified knowledge graph.",
    color: "from-amber-400/20 to-amber-400/5",
    border: "border-amber-400/20",
    iconBg: "bg-amber-400/15",
    iconColor: "text-amber-400",
    barColor: "bg-amber-400",
  },
  {
    icon: RocketLaunch,
    title: "Teams Move Faster",
    desc: "With everything in one place, teams ship 40% faster. No more context switching. No more lost information.",
    color: "from-emerald-400/20 to-emerald-400/5",
    border: "border-emerald-400/20",
    iconBg: "bg-emerald-400/15",
    iconColor: "text-emerald-400",
    barColor: "bg-emerald-400",
  },
];

function ScrubBar({ barColor }: { barColor: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current!,
        { width: "0%" },
        {
          width: "100%",
          ease: "none",
          scrollTrigger: {
            trigger: ref.current!.closest("section"),
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1.5,
          },
        }
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className="mt-6 h-1 w-full rounded-full bg-white/[0.04] overflow-hidden">
      <div ref={ref} className={`h-full rounded-full ${barColor}`} />
    </div>
  );
}

function ConnectionArrow({ index }: { index: number }) {
  return (
    <div className="hidden lg:flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 + index * 0.3, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
        className="relative flex items-center"
      >
        <div className="h-px w-16 bg-gradient-to-r from-primary/40 to-primary/10" />
        <ArrowRight size={16} className="text-primary/40" weight="bold" />
      </motion.div>
    </div>
  );
}

export default function WorkflowTransformation() {
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
            How It Works
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            From Fragmented Workflows To Clear Execution
          </h2>
        </motion.div>

        <div className="mt-16 lg:mt-20">
          <div className="flex flex-col items-center gap-8 lg:flex-row lg:gap-0">
            {steps.map((s, i) => (
              <div key={s.title} className="flex w-full flex-col items-center lg:flex-row lg:flex-1">
                <motion.div
                  variants={staggerItem}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="card-premium group relative w-full rounded-2xl p-8 transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${s.iconBg} border ${s.border}`}>
                      <s.icon size={24} className={s.iconColor} />
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] text-xs font-medium text-ink-subtle">
                      {i + 1}
                    </div>
                  </div>

                  <h3 className="mt-5 text-lg font-medium text-ink">{s.title}</h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-ink-muted">{s.desc}</p>

                  <ScrubBar barColor={s.barColor} />
                </motion.div>

                {i < steps.length - 1 && <ConnectionArrow index={i} />}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto mt-16 max-w-3xl rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 text-center backdrop-blur-sm"
        >
          <p className="text-[22px] font-medium leading-snug text-ink">
            "Teams using FlowBoard report a <span className="text-primary">40% reduction</span> in time spent searching for information and a <span className="text-emerald-400">30% increase</span> in shipping velocity."
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-white/[0.08]" />
            <span className="text-[13px] text-ink-subtle">Based on 2,000+ team surveys</span>
            <div className="h-px w-12 bg-white/[0.08]" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
