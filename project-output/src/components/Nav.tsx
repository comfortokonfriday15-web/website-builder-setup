import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from "motion/react";

const links = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "#" },
  { label: "Docs", href: "#" },
];

function Logo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#5e6ad2" />
      <rect x="6" y="11" width="6" height="13" rx="2" fill="white" opacity="0.5" />
      <rect x="14" y="8" width="6" height="16" rx="2" fill="white" opacity="0.8" />
      <rect x="22" y="14" width="6" height="10" rx="2" fill="white" />
    </svg>
  );
}

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggle = useCallback(() => setOpen((p) => !p), []);

  const { scrollY } = useScroll();
  const scrollProgress = useTransform(scrollY, [0, 60], [0, 1]);

  const navHeight = useSpring(useTransform(scrollProgress, [0, 1], [88, 64]), {
    stiffness: 200,
    damping: 20,
  });
  const navOpacity = useSpring(useTransform(scrollProgress, [0, 1], [0.7, 0.95]), {
    stiffness: 200,
    damping: 20,
  });
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-5 px-6">
      <motion.div
        initial={{ opacity: 0, y: -88 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        style={{ height: navHeight, opacity: navOpacity }}
        className={`flex w-full max-w-6xl items-center gap-8 rounded-2xl border px-7 backdrop-blur-2xl transition-shadow duration-500 ease-[var(--ease-out)] ${
          scrolled
            ? "border-white/10 bg-black/70 shadow-lg shadow-black/30"
            : "border-white/5 bg-black/20"
        }`}
      >
        <a href="/" className="flex items-center gap-3 pl-1">
          <Logo />
          <span className="text-[17px] font-semibold tracking-[-0.03em] text-ink">
            FlowBoard
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-[14px] text-ink-muted transition-colors duration-200 ease-[var(--ease-out)] hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex ml-auto">
          <a
            href="#"
            className="rounded-full px-5 py-2 text-[14px] font-medium text-ink-muted transition-all duration-200 ease-[var(--ease-out)] hover:text-ink active:scale-[0.97]"
          >
            Sign in
          </a>
          <a
            href="#"
            className="rounded-full bg-primary px-5 py-2 text-[14px] font-medium text-white transition-all duration-200 ease-[var(--ease-out)] hover:bg-primary-hover active:scale-[0.97] shadow-lg shadow-primary/15"
          >
            Get started
          </a>
        </div>

        <button
          onClick={toggle}
          className="relative flex h-8 w-8 items-center justify-center ml-auto md:hidden"
          aria-label="Toggle menu"
        >
          <motion.span
            animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
            className="absolute h-[1.5px] w-5 rounded-full bg-ink"
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          />
          <motion.span
            animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
            className="absolute h-[1.5px] w-5 rounded-full bg-ink"
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          />
        </button>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-24 left-6 right-6 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-3xl p-6 md:hidden"
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-[15px] text-ink-muted transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
            <div className="mt-4 flex gap-3 pt-4 border-t border-white/10">
              <a href="#" className="flex-1 rounded-full border border-white/10 px-4 py-2.5 text-center text-[13px] font-medium text-ink transition-all duration-200 hover:bg-white/5 active:scale-[0.97]">Sign in</a>
              <a href="#" className="flex-1 rounded-full bg-primary px-4 py-2.5 text-center text-[13px] font-medium text-white transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]">Get started</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
