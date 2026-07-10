import { motion } from "framer-motion";

interface Health {
  sentToday: number;
  opens: number;
  openRate: number;
  replyRate: number;
  bounceRate: number;
}

function barColor(rate: number, isBounce: boolean) {
  if (isBounce) return rate > 5 ? "#EF4444" : rate > 2 ? "#F59E0B" : "#22C55E";
  return rate > 60 ? "#22C55E" : rate > 30 ? "#F59E0B" : "#EF4444";
}

export default function CampaignHealth({ health }: { health: Health }) {
  const rows = [
    { label: "Open Rate", value: health.openRate, pct: health.openRate / 100, bounce: false },
    { label: "Reply Rate", value: health.replyRate, pct: Math.min(health.replyRate / 100, 1), bounce: false },
    { label: "Bounce Rate", value: health.bounceRate, pct: Math.min(health.bounceRate / 100, 1), bounce: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3"
    >
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-secondary">{r.label}</span>
            <span className="font-semibold font-mono text-primary">{r.value}%</span>
          </div>
          <div className="h-1 bg-dim rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: barColor(r.value, r.bounce) }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(r.pct * 100, 100)}%` }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </motion.div>
  );
}
