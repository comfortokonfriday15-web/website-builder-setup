import { motion } from "motion/react";
import { fadeUpBlur, staggerContainer, staggerItem } from "../lib/animations";

const tabs = ["Projects", "Documentation", "Team Updates", "AI Assistant"];

const sidebarItems = [
  { label: "Sprint Board", active: true },
  { label: "Roadmap", active: false },
  { label: "Backlog", active: false },
  { label: "Analytics", active: false },
];

const boardCards = [
  { status: "To Do", color: "bg-amber-400", items: ["API rate limit", "Design tokens"] },
  { status: "In Progress", color: "bg-primary", items: ["Auth refactor", "Dashboard redesign"] },
  { status: "Done", color: "bg-emerald-400", items: ["Schema migration", "Unit tests"] },
];

export default function ProductWalkthrough() {
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
            Product Tour
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            See FlowBoard in action
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            A unified interface that brings every part of your workflow together.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-16"
        >
          <div className="mx-auto max-w-6xl">
            <div className="card-premium overflow-hidden rounded-2xl">
              <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-rose-500/60" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/60" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/60" />
                </div>
                <div className="mx-auto flex items-center gap-2 rounded-full bg-white/[0.04] px-4 py-1.5 border border-white/[0.04]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 1C3.24 1 1 3.24 1 6C1 8.76 3.24 11 6 11C8.76 11 11 8.76 11 6C11 3.24 8.76 1 6 1ZM8.5 3.5L7.5 8.5L4.5 7L3.5 4.5L8.5 3.5Z" fill="#7C83FF" opacity="0.5" />
                  </svg>
                  <span className="text-[11px] text-ink-muted/60">app.flowboard.io</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 10C8.20914 10 10 8.20914 10 6C10 3.79086 8.20914 2 6 2C3.79086 2 2 3.79086 2 6C2 8.20914 3.79086 10 6 10Z" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
                  </svg>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 border border-white/20" />
                </div>
              </div>

              <div className="flex items-center gap-1 border-b border-white/[0.06] px-5 py-2">
                {tabs.map((t, i) => (
                  <div
                    key={t}
                    className={`rounded-lg px-3.5 py-1.5 text-[12px] font-medium transition-all duration-200 ${
                      i === 0
                        ? "bg-primary/10 text-primary"
                        : "text-ink-subtle hover:text-ink-muted"
                    }`}
                  >
                    {t}
                  </div>
                ))}
              </div>

              <div className="flex min-h-[400px]">
                <div className="hidden w-52 border-r border-white/[0.06] p-4 md:block">
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/15">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <rect x="0.5" y="0.5" width="4" height="4" rx="0.5" stroke="#7C83FF" strokeWidth="0.8" />
                        <rect x="7.5" y="0.5" width="4" height="4" rx="0.5" stroke="#7C83FF" strokeWidth="0.8" opacity="0.5" />
                        <rect x="0.5" y="7.5" width="4" height="4" rx="0.5" stroke="#7C83FF" strokeWidth="0.8" opacity="0.5" />
                        <rect x="7.5" y="7.5" width="4" height="4" rx="0.5" stroke="#7C83FF" strokeWidth="0.8" />
                      </svg>
                    </div>
                    <span className="text-[12px] font-medium text-ink">Workspace</span>
                  </div>
                  <div className="space-y-0.5">
                    {sidebarItems.map((s) => (
                      <div
                        key={s.label}
                        className={`rounded-lg px-3 py-2 text-[12px] transition-all duration-200 ${
                          s.active
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-ink-subtle hover:bg-white/[0.03] hover:text-ink-muted"
                        }`}
                      >
                        {s.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[15px] font-medium text-ink">Sprint 24 — Board</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1">
                        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 border border-white/20" />
                        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border border-white/20" />
                        <div className="h-5 w-5 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-white/20" />
                      </div>
                      <span className="text-[11px] text-ink-subtle">+3</span>
                    </div>
                  </div>

                  <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid gap-4 sm:grid-cols-3"
                  >
                    {boardCards.map((col) => (
                      <div key={col.status} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                        <div className="mb-3 flex items-center gap-2">
                          <div className={`h-1.5 w-1.5 rounded-full ${col.color}`} />
                          <span className="text-[11px] font-medium text-ink-muted uppercase tracking-wider">{col.status}</span>
                        </div>
                        {col.items.map((item) => (
                          <motion.div
                            key={item}
                            variants={staggerItem}
                            className="card-premium mb-2 rounded-lg p-3 border border-white/[0.04] hover:border-primary/20 transition-all duration-300 cursor-pointer group/card"
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[12px] font-medium text-ink/80 group-hover/card:text-ink transition-colors">{item}</span>
                              <span className="text-[9px] text-ink-subtle">FBR-{Math.floor(Math.random() * 200) + 10}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className="h-3 w-3 rounded-full bg-violet-500/60" />
                              <span className="text-[10px] text-ink-subtle">in review</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t border-white/[0.06] px-5 py-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span className="text-[11px] text-ink-subtle">AI syncing</span>
                </div>
                <div className="text-[11px] text-ink-subtle">Last updated 3s ago</div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="flex items-center gap-1 text-[11px] text-ink-subtle">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 0V5L8 8" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8"/></svg>
                    Auto-saved
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30, filter: "blur(4px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="card-premium absolute -right-4 -bottom-4 hidden max-w-[260px] rounded-xl border-l-2 border-l-primary/40 p-4 xl:block"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary to-violet-400 flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><circle cx="5" cy="5" r="4" stroke="white" strokeWidth="0.8"/><path d="M5 3V5.5L6.5 7" stroke="white" strokeWidth="0.8" strokeLinecap="round"/></svg>
              </div>
              <span className="text-[11px] font-medium text-ink">AI Insight</span>
            </div>
            <p className="text-[11px] text-ink-muted/80 leading-relaxed">
              Sprint velocity is trending 18% above forecast. The auth refactor is the critical path item.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
