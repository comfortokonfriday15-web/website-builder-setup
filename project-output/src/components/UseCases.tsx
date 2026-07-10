import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { Code, Lightbulb, Megaphone, Gear, Crown } from "@phosphor-icons/react";
import { fadeUpBlur, staggerContainer, staggerItem } from "../lib/animations";

const teams = [
  {
    icon: Code,
    title: "Engineering",
    desc: "Manage sprints, code reviews, and technical specs in one place. Connect PRs to tasks, auto-document decisions, and keep your team aligned without endless standups.",
    benefits: ["Sprint planning with AI insights", "Auto-linked PRs and commits", "Technical decision log"],
    color: "from-primary/20 to-primary/5",
    border: "border-primary/20",
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    icon: Lightbulb,
    title: "Product",
    desc: "Centralize feedback, roadmaps, and specs. Track feature adoption, connect user research to tickets, and make data-driven prioritization decisions.",
    benefits: ["Unified feedback hub", "Roadmap visualization", "Feature impact tracking"],
    color: "from-violet-400/20 to-violet-400/5",
    border: "border-violet-400/20",
    iconBg: "bg-violet-400/15",
    iconColor: "text-violet-400",
  },
  {
    icon: Megaphone,
    title: "Marketing",
    desc: "Coordinate campaigns, content calendars, and cross-team launches. Keep briefs, assets, and approvals together in a single campaign workspace.",
    benefits: ["Campaign playbooks", "Content calendar sync", "Cross-functional approvals"],
    color: "from-amber-400/20 to-amber-400/5",
    border: "border-amber-400/20",
    iconBg: "bg-amber-400/15",
    iconColor: "text-amber-400",
  },
  {
    icon: Gear,
    title: "Operations",
    desc: "Run projects, processes, and OKRs from a single source of truth. Automate recurring workflows and keep every stakeholder in the loop.",
    benefits: ["Process automation", "OKR tracking", "Cross-department visibility"],
    color: "from-cyan-400/20 to-cyan-400/5",
    border: "border-cyan-400/20",
    iconBg: "bg-cyan-400/15",
    iconColor: "text-cyan-400",
  },
  {
    icon: Crown,
    title: "Founders",
    desc: "See across every function — product, sales, engineering, and design — without context switching. Make faster decisions with complete information.",
    benefits: ["Company-wide visibility", "Decision log", "Executive summaries"],
    color: "from-emerald-400/20 to-emerald-400/5",
    border: "border-emerald-400/20",
    iconBg: "bg-emerald-400/15",
    iconColor: "text-emerald-400",
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

function UseCaseCard({ team }: { team: typeof teams[0] }) {
  return (
    <TiltCard>
      <motion.div
        variants={staggerItem}
        className="card-premium group rounded-2xl p-7 transition-all duration-500"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${team.iconBg} border ${team.border}`}>
            <team.icon size={20} className={team.iconColor} />
          </div>
          <h3 className="text-[17px] font-medium text-ink">{team.title}</h3>
        </div>
        <p className="text-[13px] leading-relaxed text-ink-muted">{team.desc}</p>
        <ul className="mt-4 space-y-2">
          {team.benefits.map((b) => (
            <li key={b} className="flex items-center gap-2 text-[12px] text-ink-subtle">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                <circle cx="6" cy="6" r="5" stroke="rgba(124,131,255,0.4)" strokeWidth="0.8" />
                <path d="M4 6L5.5 7.5L8 4.5" stroke="rgba(124,131,255,0.6)" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {b}
            </li>
          ))}
        </ul>
        <motion.a
          href="#"
          whileHover={{ x: 3 }}
          className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-primary/80 hover:text-primary transition-colors duration-200"
        >
          Learn more
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>
      </motion.div>
    </TiltCard>
  );
}

export default function UseCases() {
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
            Use Cases
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            Built For Every Team
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            FlowBoard adapts to how your team works — not the other way around.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {teams.slice(0, 3).map((t) => (
            <UseCaseCard key={t.title} team={t} />
          ))}
        </motion.div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-5 grid gap-5 md:grid-cols-2"
        >
          {teams.slice(3).map((t) => (
            <UseCaseCard key={t.title} team={t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
