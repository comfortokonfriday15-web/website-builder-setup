import { motion } from "framer-motion";

interface Queue {
  qualifiedReady: number;
  scheduledToday: number;
  remainingCapacity: number;
}

interface Props {
  queue: Queue;
  max?: number;
}

export default function TodayQueue({ queue, max = 30 }: Props) {
  const ratio = Math.min(queue.remainingCapacity / max, 1);
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - ratio);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center gap-4 mb-3">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
          <motion.circle
            cx="40" cy="40" r={r}
            fill="none" stroke="url(#queueGrad)"
            strokeWidth="4"
            strokeDasharray={circ}
            strokeDashoffset={circ}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          />
          <defs>
            <linearGradient id="queueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818CF8" />
              <stop offset="100%" stopColor="#6366F1" />
            </linearGradient>
          </defs>
        </svg>
        <div>
          <div className="text-2xl font-bold font-mono text-primary">{queue.remainingCapacity}</div>
          <div className="text-xs text-muted uppercase tracking-wider font-medium">remaining</div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {[
          { label: "Qualified Ready", value: queue.qualifiedReady },
          { label: "Scheduled Today", value: queue.scheduledToday },
          { label: "Daily Capacity", value: max },
        ].map((row) => (
          <div key={row.label} className="flex items-center justify-between py-1.5">
            <span className="text-sm text-secondary">{row.label}</span>
            <span className="text-sm font-semibold font-mono text-primary">{row.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
