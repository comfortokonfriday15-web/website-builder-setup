import { useEffect, useRef } from "react";
import { useSpring, animated } from "framer-motion";

interface Props {
  value: number;
  format?: (n: number) => string;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export default function AnimatedCounter({ value, format, className, prefix, suffix }: Props) {
  const spring = useSpring(0, { damping: 25, stiffness: 150 });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  useEffect(() => {
    const unsubscribe = spring.on("change", (v: number) => {
      if (ref.current) {
        const formatted = format ? format(Math.round(v)) : Math.round(v).toLocaleString();
        ref.current.textContent = `${prefix ?? ""}${formatted}${suffix ?? ""}`;
      }
    });
    return unsubscribe;
  }, [spring, format, prefix, suffix]);

  return <span ref={ref} className={className}>0</span>;
}
