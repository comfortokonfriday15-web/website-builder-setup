import { motion } from "framer-motion";

interface Niche {
  name: string;
  leads: number;
  replyRate: number;
  conceptRequests: number;
  callsBooked: number;
}

export default function TopNiche({ niche }: { niche: Niche | null }) {
  if (!niche) {
    return <div className="text-muted text-sm text-center py-6">No data yet</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="text-center"
    >
      <div className="text-base font-semibold text-primary">{niche.name}</div>
      <div className="text-xs text-muted mt-0.5 mb-3">{niche.leads} leads</div>
      <div className="flex justify-center gap-4">
        {[
          { value: `${niche.replyRate}%`, label: "Reply Rate" },
          { value: niche.conceptRequests, label: "Concepts" },
          { value: niche.callsBooked, label: "Calls" },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <motion.div
              className="text-lg font-bold font-mono text-primary"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {stat.value}
            </motion.div>
            <div className="text-10 text-muted uppercase tracking-wider font-medium">{stat.label}</div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
