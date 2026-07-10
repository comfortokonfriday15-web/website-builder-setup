import { useRef, useEffect } from "react";
import { motion } from "motion/react";
import { fadeUpBlur, staggerContainer, staggerItem } from "../lib/animations";
import { gsap } from "../lib/gsap-register";

function SvgLines() {
  const pathRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!pathRef.current) return;
    const lines = pathRef.current.querySelectorAll("line");
    const ctx = gsap.context(() => {
      lines.forEach((line) => {
        const length = line.getTotalLength?.() ?? 200;
        gsap.fromTo(line,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: "none",
            scrollTrigger: {
              trigger: pathRef.current!.closest("section"),
              start: "top 70%",
              end: "center 50%",
              scrub: 1,
            },
          }
        );
      });
    }, pathRef);
    return () => ctx.revert();
  }, []);

  return (
    <svg ref={pathRef} className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 900 500">
      <defs>
        <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(124,131,255,0)" />
          <stop offset="50%" stopColor="rgba(124,131,255,0.15)" />
          <stop offset="100%" stopColor="rgba(124,131,255,0)" />
        </linearGradient>
      </defs>
      <line x1="450" y1="250" x2="180" y2="80" stroke="rgba(124,131,255,0.2)" strokeWidth="1" />
      <line x1="450" y1="250" x2="720" y2="80" stroke="rgba(124,131,255,0.2)" strokeWidth="1" />
      <line x1="450" y1="250" x2="120" y2="380" stroke="rgba(124,131,255,0.2)" strokeWidth="1" />
      <line x1="450" y1="250" x2="780" y2="380" stroke="rgba(124,131,255,0.2)" strokeWidth="1" />
      <line x1="450" y1="250" x2="450" y2="420" stroke="rgba(124,131,255,0.2)" strokeWidth="1" />
    </svg>
  );
}

export default function UnifiedWorkspace() {
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
            Unified Workspace
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            Everything Connected. Nothing Lost.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            One intelligent surface where every piece of your workflow lives in context.
          </p>
        </motion.div>

        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative mt-20"
        >
          <div className="mx-auto max-w-5xl">
            <div className="card-premium relative overflow-hidden rounded-3xl p-1">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-violet-500/[0.03] pointer-events-none" />

              <div className="relative rounded-2xl bg-canvas-alt/80 p-8 md:p-12">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(124,131,255,0.06),transparent_60%)] pointer-events-none" />

                <SvgLines />

                <div className="relative z-10 mx-auto mb-16 flex h-28 w-28 items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 rounded-full bg-primary/10 blur-2xl"
                  />
                  <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-primary/30 bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#7C83FF" />
                    </svg>
                  </div>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
                >
                  <motion.div variants={staggerItem} className="space-y-4">
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                      className="card-premium rounded-xl border-l-2 border-l-primary/40 p-5"
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="#7C83FF" strokeWidth="1.2"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="#7C83FF" strokeWidth="1.2" opacity="0.5"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="#7C83FF" strokeWidth="1.2" opacity="0.5"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="#7C83FF" strokeWidth="1.2"/></svg>
                        </div>
                        <span className="text-sm font-medium text-ink">Tasks</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2 border border-white/[0.04]">
                          <div className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          <span className="text-xs text-ink-muted">Design system audit</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2 border border-white/[0.04]">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          <span className="text-xs text-ink-muted">API rate limit fix</span>
                        </div>
                        <div className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-3 py-2 border border-white/[0.04] opacity-60">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-xs text-ink-muted">Sprint retro prep</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-4 pt-8">
                    <motion.div
                      animate={{ y: [0, 6, 0] }}
                      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
                      className="card-premium rounded-xl border-l-2 border-l-violet-400/40 p-5"
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-400/15">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="#A78BFA" strokeWidth="1.2"/><path d="M7 4V7L8.5 8.5" stroke="#A78BFA" strokeWidth="1.2" strokeLinecap="round"/></svg>
                        </div>
                        <span className="text-sm font-medium text-ink">AI Assistant</span>
                        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                          <span className="h-1 w-1 rounded-full bg-emerald-400" />
                          Active
                        </span>
                      </div>
                      <div className="rounded-lg bg-white/[0.03] p-3 border border-white/[0.04]">
                        <p className="text-xs text-ink-muted/80 leading-relaxed">
                          "The auth refactor depends on the new API schema. I've updated the ticket and notified the backend team."
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div variants={staggerItem} className="space-y-4">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.9 }}
                      className="card-premium rounded-xl border-l-2 border-l-cyan-400/40 p-5"
                    >
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/15">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 3H12V11H2V3Z" stroke="#22D3EE" strokeWidth="1.2"/><path d="M2 6H12" stroke="#22D3EE" strokeWidth="1.2"/><rect x="3.5" y="7.5" width="3" height="2" rx="0.5" fill="#22D3EE" opacity="0.4"/></svg>
                        </div>
                        <span className="text-sm font-medium text-ink">Team Updates</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-start gap-2 rounded-lg bg-white/[0.03] px-3 py-2 border border-white/[0.04]">
                          <div className="h-5 w-5 mt-0.5 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-violet-600" />
                          <div>
                            <span className="text-xs font-medium text-ink/80">Alex Chen</span>
                            <p className="text-[11px] text-ink-muted/70">Merged PR #234 — design tokens updated</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 rounded-lg bg-white/[0.03] px-3 py-2 border border-white/[0.04]">
                          <div className="h-5 w-5 mt-0.5 shrink-0 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600" />
                          <div>
                            <span className="text-xs font-medium text-ink/80">Sarah Kim</span>
                            <p className="text-[11px] text-ink-muted/70">Sprint velocity increased 23% this week</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>

                <motion.div
                  variants={staggerItem}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="mt-6"
                >
                  <motion.div
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                    className="mx-auto max-w-md"
                  >
                    <div className="card-premium rounded-xl border-l-2 border-l-amber-400/40 p-5">
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/15">
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="2" width="12" height="10" rx="1.5" stroke="#FBBF24" strokeWidth="1.2"/><path d="M4 5H10" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round"/><path d="M4 7H8" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round"/><path d="M4 9H9" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round"/></svg>
                        </div>
                        <span className="text-sm font-medium text-ink">Documentation</span>
                        <span className="ml-auto text-[11px] text-ink-subtle">Last edited 2m ago</span>
                      </div>
                      <div className="rounded-lg bg-white/[0.03] p-3 border border-white/[0.04]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-medium text-ink/80">API Architecture v3</span>
                          <span className="text-[10px] text-ink-subtle">v2.4.1</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-ink-muted/70">
                          <span className="rounded bg-emerald-400/10 px-1.5 py-0.5 text-emerald-400">Updated</span>
                          <span>Endpoints aligned with new auth flow</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute -top-20 left-1/2 h-[300px] w-[600px] -translate-x-1/2 bg-primary/[0.03] blur-[120px]" />
        </motion.div>
      </div>
    </section>
  );
}
