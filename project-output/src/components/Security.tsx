import { motion } from "motion/react";
import { ShieldCheck, Key, Lock, FileText, UsersThree, Globe } from "@phosphor-icons/react";
import { fadeUpBlur, staggerContainer, staggerItem } from "../lib/animations";

const features = [
  { icon: ShieldCheck, title: "SOC 2 Type II", desc: "Certified for security, availability, and confidentiality. Annual third-party audits ensure ongoing compliance." },
  { icon: Key, title: "Single Sign-On", desc: "SAML 2.0, OIDC, and SCIM provisioning support. Integrates with Okta, Azure AD, Google Workspace, and OneLogin." },
  { icon: Lock, title: "Encryption at Rest", desc: "AES-256 encryption for all data at rest. TLS 1.3 for data in transit. Your data is never stored without encryption." },
  { icon: FileText, title: "Audit Logs", desc: "Complete, immutable audit trail of every action across your workspace. Exportable to your SIEM of choice." },
  { icon: UsersThree, title: "Role-Based Access", desc: "Granular permissions with custom roles, teams, and workspace-level controls. Define who sees what, down to the document level." },
  { icon: Globe, title: "Enterprise Readiness", desc: "99.99% SLA, dedicated support, data residency options, and custom terms for organizations with advanced compliance needs." },
];

export default function Security() {
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
            Security
          </span>
          <h2 className="mt-6 text-[clamp(2rem,4.5vw,3.25rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
            Built For Scale. Designed For Trust.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-muted">
            Enterprise-grade security baked into every layer of the platform.
          </p>
        </motion.div>

        <div className="mt-16">
          <motion.div
            variants={fadeUpBlur}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="card-premium group relative mb-6 overflow-hidden rounded-2xl border border-primary/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.03] via-transparent to-primary/[0.02] pointer-events-none" />
            <div className="relative flex flex-col items-center gap-6 p-8 text-center md:flex-row md:text-left">
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20"
              >
                <ShieldCheck size={36} className="text-primary" />
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold text-ink">SOC 2 Type II Certified</h3>
                <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-ink-muted">
                  FlowBoard undergoes annual SOC 2 Type II audits to ensure the highest standards of security, availability, and confidentiality. Our compliance framework covers all critical controls.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-medium text-emerald-400">Certified</span>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] text-ink-subtle">Annual audit cycle</span>
                  <span className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[11px] text-ink-subtle">Penetration tested</span>
                </div>
              </div>
              <div className="hidden md:block ml-auto">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/20 bg-primary/5">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10" stroke="#7C83FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#7C83FF" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.slice(1).map((f) => (
              <motion.div
                key={f.title}
                variants={staggerItem}
                className="card-premium group rounded-xl p-6 transition-all duration-500"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                  transition={{ duration: 0.3 }}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-ink-muted transition-all duration-300 group-hover:bg-primary/10 group-hover:border-primary/20 group-hover:text-primary"
                >
                  <f.icon size={18} />
                </motion.div>
                <h3 className="mt-4 text-[15px] font-medium text-ink">{f.title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
