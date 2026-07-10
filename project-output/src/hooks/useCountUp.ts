import { useMotionValue, useSpring, useTransform, useInView } from "motion/react";
import { useRef, useEffect } from "react";

export function useCountUp(target: number, options?: {
  duration?: number
  delay?: number
  decimal?: number
}) {
  const { duration = 2, delay = 0, decimal = 0 } = options ?? {};
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useMotionValue(0);
  const spring = useSpring(count, {
    stiffness: 30,
    damping: 12,
    duration,
  });
  const display = useTransform(spring, (v) => v.toFixed(decimal));

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => count.set(target), delay * 1000);
    return () => clearTimeout(timer);
  }, [inView, target, delay, count]);

  return { ref, display, inView };
}
