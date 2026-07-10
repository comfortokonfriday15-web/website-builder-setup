import { useRef, useCallback } from "react";
import { motion } from "motion/react";
import { useCountUp } from "../hooks/useCountUp";

function useTilt(scale = 6) {
  const ref = useRef<HTMLDivElement>(null);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    ref.current.style.setProperty("--tilt-x", `${x * scale}deg`);
    ref.current.style.setProperty("--tilt-y", `${y * -scale}deg`);
  }, [scale]);
  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.setProperty("--tilt-x", "0deg");
    ref.current.style.setProperty("--tilt-y", "0deg");
  }, []);
  return { ref, onMouseMove, onMouseLeave };
}

function ProductScene() {
  const tilt = useTilt(4);

  return (
    <div
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      className="relative w-full"
      style={{
        perspective: "1200px",
        transform: "rotateY(var(--tilt-x, 0deg)) rotateX(var(--tilt-y, 0deg))",
        transition: "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
        className="absolute -top-4 -left-2 h-[340px] w-[460px] rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_60px_rgba(0,0,0,0.6),0_0_120px_rgba(94,106,210,0.06)] backdrop-blur-xl"
        style={{ transform: "translateZ(-40px)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1.5" stroke="#828fff" strokeWidth="1.5"/><rect x="9" y="1" width="6" height="6" rx="1.5" stroke="#828fff" strokeWidth="1.5" opacity="0.5"/><rect x="1" y="9" width="6" height="6" rx="1.5" stroke="#828fff" strokeWidth="1.5" opacity="0.5"/><rect x="9" y="9" width="6" height="6" rx="1.5" stroke="#828fff" strokeWidth="1.5"/></svg>
            </div>
            <span className="text-[13px] font-medium text-ink/80">Sprint Board</span>
          </div>
          <div className="flex -space-x-1.5">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-violet-400 to-violet-600 border border-white/20 ring-1 ring-black/30" />
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 border border-white/20 ring-1 ring-black/30" />
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 border border-white/20 ring-1 ring-black/30" />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2.5 h-[220px]">
          <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.04]">
            <div className="h-2 w-12 rounded-full bg-ink-tertiary/50 mb-3" />
            <div className="space-y-2">
              <div className="h-20 rounded-lg bg-white/[0.04] p-2 border border-white/[0.04]">
                <div className="h-1.5 w-14 rounded-full bg-amber-400/60 mb-1.5" />
                <div className="h-1 w-full rounded-full bg-ink-tertiary/30 mb-1" />
                <div className="h-1 w-3/4 rounded-full bg-ink-tertiary/30" />
                <div className="flex items-center gap-1 mt-2">
                  <div className="h-4 w-4 rounded-full bg-violet-500/60" />
                  <div className="h-1 w-8 rounded-full bg-ink-tertiary/30" />
                </div>
              </div>
              <div className="h-16 rounded-lg bg-white/[0.04] p-2 border border-white/[0.04]">
                <div className="h-1.5 w-10 rounded-full bg-emerald-400/60 mb-1.5" />
                <div className="h-1 w-full rounded-full bg-ink-tertiary/30" />
                <div className="h-1 w-1/2 rounded-full bg-ink-tertiary/30 mt-1" />
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.04]">
            <div className="h-2 w-16 rounded-full bg-ink-tertiary/50 mb-3" />
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-white/[0.04] p-2 border border-white/[0.04]">
                <div className="h-1.5 w-16 rounded-full bg-red-400/60 mb-1.5" />
                <div className="h-1 w-full rounded-full bg-ink-tertiary/30 mb-1" />
                <div className="h-1 w-3/4 rounded-full bg-ink-tertiary/30 mb-1" />
                <div className="h-1 w-1/2 rounded-full bg-ink-tertiary/30" />
                <div className="flex items-center gap-1 mt-2">
                  <div className="h-4 w-4 rounded-full bg-amber-500/60" />
                  <div className="h-1 w-6 rounded-full bg-ink-tertiary/30" />
                </div>
              </div>
              <div className="h-10 rounded-lg bg-white/[0.04] p-2 border border-white/[0.04]">
                <div className="h-1.5 w-12 rounded-full bg-amber-400/60" />
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.04]">
            <div className="h-2 w-10 rounded-full bg-ink-tertiary/50 mb-3" />
            <div className="space-y-2">
              <div className="h-16 rounded-lg bg-white/[0.04] p-2 border border-white/[0.04] opacity-60">
                <div className="h-1.5 w-14 rounded-full bg-emerald-400/60 mb-1.5" />
                <div className="h-1 w-full rounded-full bg-ink-tertiary/30" />
                <div className="h-1 w-2/3 rounded-full bg-ink-tertiary/30 mt-1" />
                <div className="h-1 w-10 rounded-full bg-emerald-400/30 mt-2" />
              </div>
              <div className="h-16 rounded-lg bg-white/[0.04] p-2 border border-white/[0.04] opacity-60">
                <div className="h-1.5 w-10 rounded-full bg-emerald-400/60 mb-1.5" />
                <div className="h-1 w-full rounded-full bg-ink-tertiary/30" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-8 left-10 h-[280px] w-[380px] rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_60px_rgba(0,0,0,0.7),0_0_120px_rgba(124,131,255,0.08)] backdrop-blur-2xl"
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="flex items-center gap-2.5 mb-4">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-violet-400 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 0L8.57 5.43L14 7L8.57 8.57L7 14L5.43 8.57L0 7L5.43 5.43L7 0Z" fill="white"/></svg>
          </div>
          <span className="text-[13px] font-medium text-ink/80">AI Assistant</span>
          <span className="ml-auto text-[11px] text-emerald-400/80 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Active
          </span>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 mt-0.5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#828fff" strokeWidth="1.5"/><path d="M6 3.5V6L7.5 7.5" stroke="#828fff" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </div>
            <div className="rounded-xl bg-white/[0.05] px-3.5 py-2.5 border border-white/[0.04] flex-1">
              <p className="text-[12px] text-ink-muted/90 leading-relaxed">
                The auth refactor is blocked by the API rate limit. I've created a ticket and added it to the sprint backlog.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 mt-0.5 rounded-full bg-white/[0.06] flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4" fill="#d0d6e0"/></svg>
            </div>
            <div className="rounded-xl bg-white/[0.03] px-3.5 py-2.5 border border-white/[0.04] flex-1">
              <p className="text-[12px] text-ink-muted/60 leading-relaxed">
                Can you summarize the PR discussion on the design system branch?
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="h-6 w-6 mt-0.5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="#828fff" strokeWidth="1.5"/><path d="M6 3.5V6L7.5 7.5" stroke="#828fff" strokeWidth="1.2" strokeLinecap="round"/></svg>
            </div>
            <div className="rounded-xl bg-white/[0.05] px-3.5 py-2.5 border border-white/[0.04] flex-1">
              <p className="text-[12px] text-primary-hover/80 leading-relaxed">
                4 comments resolved. Remaining: color token naming convention. Should we use camelCase or kebab-case?
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-16 left-56 h-[200px] w-[320px] rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_8px_60px_rgba(0,0,0,0.5),0_0_100px_rgba(90,103,255,0.05)] backdrop-blur-xl"
        style={{ transform: "translateZ(40px)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="3" cy="3" r="2.5" stroke="#828fff" strokeWidth="1.2"/><circle cx="11" cy="3" r="2.5" stroke="#828fff" strokeWidth="1.2"/><circle cx="7" cy="11" r="2.5" stroke="#828fff" strokeWidth="1.2"/><line x1="4.5" y1="4.5" x2="6.5" y2="9.5" stroke="#828fff" strokeWidth="0.8" opacity="0.5"/><line x1="9.5" y1="4.5" x2="7.5" y2="9.5" stroke="#828fff" strokeWidth="0.8" opacity="0.5"/></svg>
          <span className="text-[12px] font-medium text-ink/70">Knowledge Graph</span>
        </div>
        <div className="relative h-[120px]">
          <svg viewBox="0 0 280 120" fill="none" className="w-full h-full">
            <circle cx="50" cy="40" r="18" fill="rgba(94,106,210,0.12)" stroke="rgba(94,106,210,0.3)" strokeWidth="0.5" />
            <text x="50" y="44" textAnchor="middle" fill="#8a8f98" fontSize="8" fontWeight="500">API</text>
            <circle cx="130" cy="25" r="14" fill="rgba(16,185,129,0.1)" stroke="rgba(16,185,129,0.25)" strokeWidth="0.5" />
            <text x="130" y="28" textAnchor="middle" fill="#8a8f98" fontSize="7" fontWeight="500">DB</text>
            <circle cx="210" cy="35" r="16" fill="rgba(245,158,11,0.1)" stroke="rgba(245,158,11,0.25)" strokeWidth="0.5" />
            <text x="210" y="39" textAnchor="middle" fill="#8a8f98" fontSize="7" fontWeight="500">Auth</text>
            <circle cx="90" cy="90" r="20" fill="rgba(124,131,255,0.12)" stroke="rgba(124,131,255,0.3)" strokeWidth="0.5" />
            <text x="90" y="94" textAnchor="middle" fill="#d0d6e0" fontSize="8" fontWeight="500">Flow</text>
            <circle cx="180" cy="85" r="12" fill="rgba(239,68,68,0.08)" stroke="rgba(239,68,68,0.2)" strokeWidth="0.5" />
            <text x="180" y="88" textAnchor="middle" fill="#8a8f98" fontSize="6" fontWeight="500">UI</text>
            <circle cx="240" cy="80" r="10" fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.2)" strokeWidth="0.5" />
            <line x1="62" y1="52" x2="120" y2="36" stroke="rgba(94,106,210,0.15)" strokeWidth="0.5" />
            <line x1="140" y1="38" x2="198" y2="44" stroke="rgba(94,106,210,0.12)" strokeWidth="0.5" />
            <line x1="62" y1="55" x2="80" y2="76" stroke="rgba(124,131,255,0.15)" strokeWidth="0.5" />
            <line x1="110" y1="85" x2="170" y2="82" stroke="rgba(94,106,210,0.1)" strokeWidth="0.5" />
            <line x1="195" y1="82" x2="230" y2="78" stroke="rgba(139,92,246,0.1)" strokeWidth="0.5" />
          </svg>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 0 }}
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
        className="absolute top-56 left-12 h-[80px] w-[420px] rounded-xl border border-white/[0.05] bg-white/[0.02] px-5 py-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
        style={{ transform: "translateZ(10px)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="1" y="8" width="4" height="7" rx="1" fill="#828fff" opacity="0.6"/><rect x="6" y="4" width="4" height="11" rx="1" fill="#828fff"/><rect x="11" y="1" width="4" height="14" rx="1" fill="#828fff" opacity="0.4"/></svg>
            </div>
            <div>
              <span className="text-[11px] text-ink-tertiary">Sprint velocity</span>
              <div className="text-[15px] font-semibold text-ink/90">47 pts</div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/[0.05]" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-400/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="#27a644" strokeWidth="1.5"/><path d="M5 8.5L7 10.5L11 6" stroke="#27a644" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <span className="text-[11px] text-ink-tertiary">Tasks completed</span>
              <div className="text-[15px] font-semibold text-emerald-400/90">24 / 31</div>
            </div>
          </div>
          <div className="w-px h-10 bg-white/[0.05]" />
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1L10 5.5L15 6.5L11.5 10.5L12 16L8 13.5L4 16L4.5 10.5L1 6.5L6 5.5L8 1Z" fill="#f59e0b" opacity="0.6"/></svg>
            </div>
            <div>
              <span className="text-[11px] text-ink-tertiary">Team health</span>
              <div className="text-[15px] font-semibold text-amber-400/90">Great</div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="absolute -top-20 -right-20 h-[400px] w-[400px] rounded-full bg-primary/[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-20 h-[250px] w-[250px] rounded-full bg-violet-500/[0.04] blur-[100px] pointer-events-none" />
    </div>
  );
}

function CountUpValue({ target, suffix = "" }: { target: number; suffix?: string }) {
  const { ref, display } = useCountUp(target, { duration: 2, delay: 0.5 });
  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-[920px] overflow-hidden pt-[120px] md:pt-[140px] flex items-center hero-bg">
      <div className="pointer-events-none absolute inset-0 opacity-[0.015] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-primary/[0.04] blur-[150px]" />
      <div className="pointer-events-none absolute top-1/3 left-1/4 h-[400px] w-[400px] rounded-full bg-violet-500/[0.03] blur-[120px]" />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-16">

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 backdrop-blur-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[12px] font-medium tracking-[0.12em] text-ink-muted uppercase">
                Now in public beta
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(72px,8vw,110px)] font-extrabold leading-[0.92] tracking-[-4px]"
            >
              <span className="text-ink">Build Faster.</span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary-hover to-violet-300 bg-clip-text text-transparent">
                Think Deeper.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 max-w-[620px] text-[16px] leading-relaxed text-ink-muted md:text-[17px]"
            >
              Your projects, documentation, conversations, and decisions connected in one intelligent workspace built for modern teams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="mt-10 flex flex-col items-start gap-4 sm:flex-row"
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
                  className="transition-transform duration-300"
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                >
                  <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </motion.svg>
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex h-14 items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-8 text-[15px] font-medium text-ink-muted transition-all duration-300 ease-[var(--ease-out)] hover:bg-white/[0.06] hover:text-ink backdrop-blur-sm"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M6 5.5V11M10 5.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                Book Demo
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55, ease: [0.23, 1, 0.32, 1] }}
              className="mt-10 flex items-center gap-6"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full border-2 border-canvas bg-gradient-to-br from-violet-400 to-violet-600" />
                  <div className="h-6 w-6 rounded-full border-2 border-canvas bg-gradient-to-br from-emerald-400 to-emerald-600" />
                  <div className="h-6 w-6 rounded-full border-2 border-canvas bg-gradient-to-br from-amber-400 to-amber-600" />
                </div>
                <span className="text-[13px] font-medium text-ink">
                  <CountUpValue target={20} suffix=",000+" />
                </span>
                <span className="text-[13px] text-ink-tertiary">teams</span>
              </div>
              <div className="w-px h-5 bg-hairline" />
              <span className="text-[13px] text-ink-tertiary">
                <span className="text-ink font-medium">
                  <CountUpValue target={99} suffix=".98%" />
                </span> uptime
              </span>
              <div className="w-px h-5 bg-hairline" />
              <span className="text-[13px] text-ink-tertiary">SOC 2</span>
              <div className="w-px h-5 bg-hairline" />
              <span className="text-[13px] text-ink-tertiary">Enterprise-ready</span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="relative hidden lg:block w-full"
            style={{ minHeight: "580px" }}
          >
            <div className="absolute -right-20 -top-10 w-[580px]">
              <ProductScene />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
