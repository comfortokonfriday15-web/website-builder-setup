import { motion } from "framer-motion";
import AnimatedCounter from "./AnimatedCounter";

interface Props {
  label: string;
  value: number;
  format?: (n: number) => string;
  accent?: boolean;
  success?: boolean;
  footer?: string;
  progress?: { current: number; max: number };
  small?: boolean;
  delay?: number;
}

export default function MetricCard({ label, value, format, accent, success, footer, progress, small, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -2, borderColor: "rgba(255,255,255,0.10)" }}
      className={`glass rounded-xl card-glow ${small ? "p-3" : "p-4"}`}
    >
      <div className={`font-semibold text-muted uppercase tracking-wider ${small ? "text-10 mb-1" : "text-xs mb-1"}`}>
        {label}
      </div>
      <AnimatedCounter
        value={value}
        format={format}
        className={small ? "metric-value-sm" : `metric-value ${accent ? "accent-gradient" : ""} ${success ? "success-gradient" : ""}`}
      />
      {progress && (
        <div className="mt-2 h-1 bg-dim rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#818CF8] to-[#6366F1]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((progress.current / progress.max) * 100, 100)}%` }}
            transition={{ duration: 1, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      )}
      {footer && (
        <div className={`${small ? "text-10 mt-0.5" : "text-xs mt-1"} text-muted`}>{footer}</div>
      )}
    </motion.div>
  );
}
