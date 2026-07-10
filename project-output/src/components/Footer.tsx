import { motion } from "motion/react";
import { GithubLogo, XLogo } from "@phosphor-icons/react";

const productLinks = [
  { label: "Features", href: "#" },
  { label: "Integrations", href: "#" },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "#" },
  { label: "API", href: "#" },
  { label: "Status", href: "#" },
];

const resourceLinks = [
  { label: "Documentation", href: "#" },
  { label: "Guides", href: "#" },
  { label: "Blog", href: "#" },
  { label: "Community", href: "#" },
  { label: "Templates", href: "#" },
  { label: "Support", href: "#" },
];

const companyLinks = [
  { label: "About", href: "#" },
  { label: "Careers", href: "#" },
  { label: "Security", href: "#" },
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Contact", href: "#" },
];

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="relative inline-block text-[13px] text-ink-muted transition-colors duration-200 hover:text-ink"
    >
      {children}
      <motion.span
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-0.5 left-0 h-px w-full bg-primary/40 origin-left"
      />
    </a>
  );
}

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      whileHover={{ rotate: [0, -8, 8, -4, 0], scale: 1.1 }}
      transition={{ duration: 0.4 }}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.02] text-ink-muted transition-all duration-200 hover:border-primary/20 hover:bg-primary/10 hover:text-primary"
      aria-label={label}
    >
      {children}
    </motion.a>
  );
}

export default function Footer() {
  return (
    <footer className="section-gradient border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" rx="7" fill="#5e6ad2" />
                <rect x="5" y="10" width="5" height="11" rx="1.5" fill="white" opacity="0.5" />
                <rect x="12" y="7" width="5" height="14" rx="1.5" fill="white" opacity="0.8" />
                <rect x="19" y="12" width="5" height="9" rx="1.5" fill="white" />
              </svg>
              <span className="text-[17px] font-semibold tracking-[-0.02em] text-ink">FlowBoard</span>
            </div>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-ink-muted">
              The intelligent workspace that connects your projects, documentation, conversations, and decisions. Built for teams that ship.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <SocialIcon href="#" label="GitHub">
                <GithubLogo size={16} />
              </SocialIcon>
              <SocialIcon href="#" label="X">
                <XLogo size={14} />
              </SocialIcon>
            </div>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold tracking-[0.08em] text-ink uppercase">Product</h4>
            <ul className="mt-4 space-y-3">
              {productLinks.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold tracking-[0.08em] text-ink uppercase">Resources</h4>
            <ul className="mt-4 space-y-3">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold tracking-[0.08em] text-ink uppercase">Company</h4>
            <ul className="mt-4 space-y-3">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row">
          <p className="text-[12px] text-ink-subtle">
            &copy; {new Date().getFullYear()} FlowBoard. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <FooterLink href="#">Status</FooterLink>
            <FooterLink href="#">Privacy</FooterLink>
            <FooterLink href="#">Terms</FooterLink>
            <span className="flex items-center gap-1.5 text-[12px] text-ink-subtle">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
