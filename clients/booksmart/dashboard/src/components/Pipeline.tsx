import { motion } from "framer-motion";

interface Stage {
  id: string;
  label: string;
  count: number;
  conversion: number | null;
}

interface Props {
  stages: Stage[];
}

const stageIcons: Record<string, string> = {
  qualified: "○",
  contacted: "◉",
  replied: "↩",
  concept_requested: "◇",
  concept_delivered: "◆",
  call_booked: "📞",
  won: "★",
};

export default function Pipeline({ stages }: Props) {
  if (!stages || stages.length === 0) {
    return <div className="text-muted text-sm text-center py-6">No pipeline data yet</div>;
  }

  return (
    <div className="flex flex-col gap-0.5">
      {stages.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            whileHover={{ scale: 1.01, borderColor: "rgba(255,255,255,0.10)" }}
            className="flex items-center gap-3 px-4 py-3 glass rounded-lg transition-colors"
          >
            <span className="text-sm w-6 text-center text-muted">
              {stageIcons[s.id] || "•"}
            </span>
            <span className="text-sm font-medium text-secondary min-w-130">
              {s.label}
            </span>
            <span className="text-xl font-bold font-mono text-primary min-w-36">
              {s.count}
            </span>
            {s.conversion !== null && (
              <span className="text-xs font-mono text-muted">
                {s.conversion}%
              </span>
            )}
          </motion.div>
          {i < stages.length - 1 && (
            <div className="pipeline-arrow">↓</div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
