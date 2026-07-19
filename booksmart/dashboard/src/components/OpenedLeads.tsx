import { motion } from "framer-motion";

interface OpenedLead {
  leadId: string;
  name: string;
  email: string;
  stepOrder: number;
  openedAt: string;
}

const stepLabels: Record<number, string> = {
  0: "Initial",
  1: "Follow-up 1",
  2: "Final note",
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

export default function OpenedLeads({ leads }: { leads: OpenedLead[] }) {
  if (!leads || leads.length === 0) {
    return <div className="text-muted text-sm text-center py-6">No opens yet</div>;
  }

  return (
    <div className="flex flex-col gap-0 divide-muted">
      {leads.slice(0, 10).map((lead, i) => (
        <motion.div
          key={`${lead.leadId}-${lead.stepOrder}`}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.03, duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 px-3 py-2.5 hover-bg transition-colors"
        >
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: "#06B6D4" }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">{lead.name}</p>
            <p className="text-xs text-muted truncate">{lead.email}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="text-xs font-mono text-cyan px-1.5 py-0.5 rounded bg-cyan/10">
              {stepLabels[lead.stepOrder] || `Step ${lead.stepOrder}`}
            </span>
            <p className="text-10 text-muted mt-0.5">{timeAgo(lead.openedAt)}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
