import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, Star } from "@phosphor-icons/react";
import { fadeUpBlur } from "../lib/animations";

const plans = [
  {
    name: "Starter",
    monthlyPrice: "19",
    annualPrice: "15",
    desc: "For small teams getting started with FlowBoard",
    features: [
      "Up to 10 users",
      "Unlimited projects & tasks",
      "5 active sprints",
      "Basic AI suggestions",
      "Community support",
      "1TB storage",
    ],
    cta: "Start Free",
    featured: false,
  },
  {
    name: "Growth",
    monthlyPrice: "49",
    annualPrice: "39",
    desc: "For growing teams that need advanced capabilities",
    features: [
      "Unlimited users",
      "Unlimited projects & tasks",
      "Unlimited sprints",
      "Advanced AI assistant",
      "Priority support (4h response)",
      "10TB storage",
      "Custom workflows",
      "Analytics & reporting",
    ],
    cta: "Start Trial",
    featured: true,
    badge: "Most popular",
  },
  {
    name: "Enterprise",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    desc: "For organizations with advanced security and compliance needs",
    features: [
      "Everything in Growth",
      "SSO & SCIM provisioning",
      "Audit logs & compliance",
      "Dedicated success manager",
      "Custom integrations",
      "Unlimited storage",
      "99.99% SLA",
      "On-premise option",
    ],
    cta: "Contact Sales",
    featured: false,
  },
];

function PricingCard({ plan, annual }: { plan: typeof plans[0]; annual: boolean }) {
  return (
    <div className={`relative ${plan.featured ? "lg:-mt-4 lg:mb-[-16px]" : ""}`}>
        {plan.featured && (
          <div className="absolute -inset-[1.5px] rounded-2xl bg-gradient-to-b from-primary/30 via-primary/10 to-transparent opacity-60 blur-[2px]" />
        )}
        <div
          className={`relative h-full rounded-2xl border bg-surface-1 p-8 transition-all duration-500 ease-[var(--ease-out)] ${
            plan.featured
              ? "border-primary/30 hover:border-primary/50 shadow-lg shadow-primary/5"
              : "border-white/[0.08] hover:border-white/[0.15]"
          }`}
        >
          {plan.badge && (
            <motion.div
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 border border-primary/20"
            >
              <Star size={10} weight="fill" className="text-primary" />
              <span className="text-[10px] font-semibold text-primary tracking-[0.08em] uppercase">{plan.badge}</span>
            </motion.div>
          )}

          <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
          <p className="mt-1 text-[13px] text-ink-muted">{plan.desc}</p>

          <AnimatePresence mode="wait">
            <motion.div
              key={annual ? "annual" : "monthly"}
              initial={{ opacity: 0, y: -4, filter: "blur(2px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 4, filter: "blur(2px)" }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="mt-6 flex items-baseline gap-1"
            >
              {plan.monthlyPrice !== "Custom" ? (
                <>
                  <span className="text-[40px] font-bold tracking-[-0.03em] text-ink">
                    ${annual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-[13px] text-ink-subtle">/user/month</span>
                </>
              ) : (
                <span className="text-[32px] font-bold tracking-[-0.03em] text-ink">Custom</span>
              )}
            </motion.div>
          </AnimatePresence>

          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className={`group/btn mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-[14px] font-medium transition-all duration-300 ease-[var(--ease-out)] ${
              plan.featured
                ? "bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/20"
                : "border border-white/[0.08] bg-white/[0.03] text-ink-muted hover:bg-white/[0.06] hover:text-ink"
            }`}
          >
            {plan.cta}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="transition-transform duration-300 group-hover/btn:translate-x-0.5">
              <path d="M3 7H11M11 7L7.5 3.5M11 7L7.5 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>

          <ul className="mt-6 space-y-3 pt-6 border-t border-white/[0.06]">
            {plan.features.map((f) => (
              <motion.li
                key={f}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="flex items-center gap-2.5 text-[13px] text-ink-muted"
              >
                <CheckCircle size={14} weight="fill" className="shrink-0 text-success" />
                {f}
              </motion.li>
            ))}
          </ul>
        </div>
    </div>
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="section-gradient-alt py-28 md:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          variants={fadeUpBlur}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-block rounded-full border border-white/[0.06] bg-white/[0.03] px-3.5 py-1 text-[11px] font-medium tracking-[0.15em] text-primary uppercase backdrop-blur-sm">
            Pricing
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            Simple Pricing That Scales
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Start free. Upgrade as your team grows.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-surface-1 px-4 py-1.5">
            <span className={`text-xs font-medium transition-colors ${!annual ? "text-ink" : "text-ink-subtle"}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative h-5 w-9 rounded-full transition-colors duration-300 ease-[var(--ease-out)] ${
                annual ? "bg-primary" : "bg-white/[0.1]"
              }`}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white`}
                style={{ translateX: annual ? "16px" : "0px" }}
              />
            </button>
            <span className={`text-xs font-medium transition-colors ${annual ? "text-ink" : "text-ink-subtle"}`}>
              Annual
            </span>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
              Save 20%
            </span>
          </div>
        </motion.div>

        <div className="pricing-grid mt-14 grid gap-6 lg:grid-cols-3 lg:gap-5">
          {plans.map((p) => (
            <PricingCard key={p.name} plan={p} annual={annual} />
          ))}
        </div>
      </div>
    </section>
  );
}
