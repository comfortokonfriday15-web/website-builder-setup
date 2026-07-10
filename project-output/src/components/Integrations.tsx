import { motion } from "motion/react";
import { fadeUpBlur, staggerContainer, staggerItem } from "../lib/animations";

const integrations = [
  { name: "GitHub", icon: "GH" },
  { name: "Slack", icon: "SL" },
  { name: "Notion", icon: "NO" },
  { name: "Linear", icon: "LN" },
  { name: "Jira", icon: "JR" },
  { name: "Figma", icon: "FG" },
  { name: "Google Drive", icon: "GD" },
];

function IntegrationLogo({ name, icon }: { name: string; icon: string }) {
  return (
    <motion.div
      variants={staggerItem}
      className="card-premium group relative flex items-center gap-4 rounded-xl p-5 transition-all duration-500 cursor-pointer"
    >
      <div className="relative overflow-hidden">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm font-bold text-ink-muted transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary relative z-10">
          {icon}
        </div>
        <motion.div
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          whileHover={{ clipPath: "inset(0 0 0 0)" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 rounded-xl bg-primary/10 border border-primary/30"
        />
      </div>
      <div className="flex-1">
        <h4 className="text-[14px] font-medium text-ink transition-colors duration-300 group-hover:text-primary">{name}</h4>
        <p className="mt-0.5 text-[12px] text-ink-subtle">Connected via API</p>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -4 }}
        whileHover={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.06] group-hover:border-primary/30"
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

export default function Integrations() {
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
            Integrations
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            Works With Your Existing Stack
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            FlowBoard connects with the tools you already use — no migration required.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {integrations.map((integration) => (
            <IntegrationLogo key={integration.name} name={integration.name} icon={integration.icon} />
          ))}
          <motion.div
            variants={staggerItem}
            className="card-premium flex items-center justify-center rounded-xl p-5 border border-dashed border-white/[0.08] hover:border-primary/20 transition-all duration-500 group cursor-pointer"
          >
            <div className="text-center">
              <span className="text-[24px] font-light text-ink-subtle">+</span>
              <p className="mt-1 text-[12px] text-ink-subtle group-hover:text-primary transition-colors">API Access</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
