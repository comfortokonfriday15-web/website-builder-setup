import { motion } from "framer-motion";

interface Event {
  id: string;
  lead_name: string;
  lead_email: string;
  type: string;
  createdAt: string;
  kind: "email" | "lead";
}

interface Props {
  events: Event[];
}

const dotColors: Record<string, string> = {
  sent: "#22C55E",
  bounced: "#F59E0B",
  replied: "#6366F1",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ActivityFeed({ events }: Props) {
  if (!events || events.length === 0) {
    return <div className="text-muted text-sm text-center py-8">No activity yet</div>;
  }

  return (
    <div className="flex flex-col divide-muted">
      {events.slice(0, 20).map((e, i) => (
        <motion.div
          key={e.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.02, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start gap-3 px-4 py-3 hover-bg transition-colors"
        >
          <span
            className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
            style={{ background: dotColors[e.type] || "#6B7280" }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-secondary leading-relaxed">
              <strong className="font-medium text-primary">{e.lead_name}</strong>
              {" — "}{e.type.replace(/-/g, " ")}
            </p>
            <p className="text-xs text-muted mt-0.5">{timeAgo(e.createdAt)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
