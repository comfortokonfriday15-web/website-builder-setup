import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Brain, Users, FileText, ChartBar } from "@phosphor-icons/react";
import { fadeUpBlur, staggerContainer, staggerItem } from "../lib/animations";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Knowledge",
    desc: "FlowBoard's AI automatically connects decisions, action items, and context across your entire workspace. Ask questions in natural language and get instant answers sourced from your team's collective knowledge.",
    highlights: ["Natural language queries", "Automatic context linking", "Smart summaries", "Decision capture"],
    gradient: "from-primary/10 to-violet-500/5",
    border: "border-primary/20",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    desc: "Co-edit documents, review designs, and discuss decisions in real time. Every change is synced instantly across your team with edit history and version control baked in.",
    highlights: ["Live co-editing", "Threaded discussions", "Version history", "Mentions & notifications"],
    gradient: "from-emerald-400/10 to-emerald-400/5",
    border: "border-emerald-400/20",
    iconBg: "bg-emerald-400/15",
    iconColor: "text-emerald-400",
  },
  {
    icon: FileText,
    title: "Integrated Documentation",
    desc: "Write and organize documentation alongside your projects. No more switching between tools — your specs, runbooks, and RFCs live right where your team works.",
    highlights: ["Rich text editor", "Code blocks & embeds", "Bi-directional links", "Template library"],
    gradient: "from-amber-400/10 to-amber-400/5",
    border: "border-amber-400/20",
    iconBg: "bg-amber-400/15",
    iconColor: "text-amber-400",
  },
  {
    icon: ChartBar,
    title: "Project Intelligence",
    desc: "Understand how your team is performing with real-time analytics. Track velocity, identify bottlenecks, and forecast delivery dates with data-driven insights.",
    highlights: ["Sprint analytics", "Bottleneck detection", "Delivery forecasting", "Custom dashboards"],
    gradient: "from-cyan-400/10 to-cyan-400/5",
    border: "border-cyan-400/20",
    iconBg: "bg-cyan-400/15",
    iconColor: "text-cyan-400",
  },
];

function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [2, -2]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-2, 2]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }, [x, y]);

  const onMouseLeave = useCallback(() => { x.set(0); y.set(0); }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, perspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function CoreCapabilities() {
  return (
    <section className="section-gradient-alt py-28 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1 text-[11px] font-medium tracking-[0.15em] text-primary uppercase backdrop-blur-sm">
            Core Capabilities
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            Everything your team needs to ship faster
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Four integrated capabilities that eliminate context switching.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 space-y-6"
        >
          {features.map((f, i) => {
            const isReversed = i % 2 === 1;
            return (
              <TiltCard key={f.title}>
                <motion.div
                  variants={staggerItem}
                  className={`card-premium rounded-2xl p-6 md:p-8 transition-all duration-500 ${isReversed ? "md:flex-row-reverse" : ""} flex flex-col md:flex-row md:items-center md:gap-12`}
                >
                  <div className={`relative flex-1 ${isReversed ? "md:text-right" : ""}`}>
                    <div className={`relative mx-auto max-w-md overflow-hidden rounded-xl border ${f.border} bg-gradient-to-br ${f.gradient} p-6 md:p-8`}>
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,131,255,0.04),transparent_60%)] pointer-events-none" />
                      <div className="relative grid grid-cols-2 gap-3">
                        {f.highlights.map((h) => (
                          <div key={h} className="card-premium rounded-lg px-3 py-2.5 text-center border border-white/[0.04]">
                            <span className="text-[11px] font-medium text-ink-muted">{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`flex-1 mt-6 md:mt-0 ${isReversed ? "md:text-right" : ""}`}>
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.iconBg} border ${f.border} mb-4`}>
                      <f.icon size={22} className={f.iconColor} />
                    </div>
                    <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">{f.title}</h3>
                    <p className={`mt-3 max-w-md text-[14px] leading-relaxed text-ink-muted ${isReversed ? "md:ml-auto" : ""}`}>
                      {f.desc}
                    </p>
                    <div className={`mt-5 flex flex-wrap gap-2 ${isReversed ? "md:justify-end" : ""}`}>
                      {f.highlights.map((h) => (
                        <span key={h} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] text-ink-subtle">
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </TiltCard>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
