import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CronRun {
  id: string;
  type: string;
  status: "success" | "error" | "running";
  startedat: string;
  finishedat: string | null;
  duration: number | null;
  metadata: any;
  error: string | null;
  result: string | null;
}

const TYPE_ICONS: Record<string, string> = {
  "cron.process-sequence": "📤",
  "cron.check-replies": "📬",
  "cron.sync-leads": "🔄",
  "webhook.form": "📋",
  "webhook.booking": "📅",
  "webhook.payment": "💳",
  "webhook.missed-call": "📞",
};

const TYPE_LABELS: Record<string, string> = {
  "cron.process-sequence": "Process Sequence",
  "cron.check-replies": "Check Replies",
  "cron.sync-leads": "Sync Leads",
  "webhook.form": "Form Submission",
  "webhook.booking": "Booking",
  "webhook.payment": "Payment",
  "webhook.missed-call": "Missed Call",
};

const STATUS_COLORS = {
  success: { dot: "#22C55E", bg: "rgba(34,197,94,0.08)", text: "#22C55E", border: "rgba(34,197,94,0.15)" },
  error: { dot: "#EF4444", bg: "rgba(239,68,68,0.08)", text: "#EF4444", border: "rgba(239,68,68,0.15)" },
  running: { dot: "#F59E0B", bg: "rgba(245,158,11,0.08)", text: "#F59E0B", border: "rgba(245,158,11,0.15)" },
};

export default function Runs() {
  const [runs, setRuns] = useState<CronRun[]>([]);
  const [summary, setSummary] = useState({ total: 0, success: 0, error: 0, running: 0 });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/runs?limit=200");
      if (!r.ok) throw new Error(`Runs: ${r.status}`);
      const data = await r.json();
      setRuns(data.runs ?? []);
      setSummary(data.summary ?? { total: 0, success: 0, error: 0, running: 0 });
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const i = setInterval(load, 15000); return () => clearInterval(i); }, [load]);

  const types = [...new Set(runs.map((r) => r.type))].sort();

  const filtered = runs.filter((r) => {
    if (filterType !== "all" && r.type !== filterType) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      const meta = JSON.stringify(r.metadata ?? {}).toLowerCase();
      if (!meta.includes(q) && !r.type.toLowerCase().includes(q) && !r.error?.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const grouped = filtered.reduce((acc, run) => {
    if (!acc[run.type]) acc[run.type] = [];
    acc[run.type].push(run);
    return acc;
  }, {} as Record<string, CronRun[]>);

  // Sort groups by latest run
  const sortedGroups = Object.entries(grouped).sort(([, a], [, b]) => {
    const aLatest = Math.max(...a.map((r) => new Date(r.startedat).getTime()));
    const bLatest = Math.max(...b.map((r) => new Date(r.startedat).getTime()));
    return bLatest - aLatest;
  });

  const chartData = filtered.slice(0, 60).sort((a, b) => new Date(a.startedat).getTime() - new Date(b.startedat).getTime());
  const chartMin = chartData.length > 0 ? new Date(chartData[0].startedat).getTime() : Date.now() - 3600000;
  const chartMax = chartData.length > 0 ? new Date(chartData[chartData.length - 1].startedat).getTime() : Date.now();
  const chartSpan = Math.max(chartMax - chartMin, 1);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-sm shadow-lg shadow-cyan-500/20">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-primary tracking-tight">Run Logs</h2>
              {loading && (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-400"
                />
              )}
              {!loading && summary.running > 0 && (
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400"
                >
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400" />
                  {summary.running} running
                </motion.span>
              )}
            </div>
            <p className="text-[11px] text-muted font-medium">Real-time execution monitor</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={load}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg text-[11px] font-medium text-white bg-gradient-to-br from-cyan-500 to-cyan-600 shadow-lg shadow-cyan-500/20 disabled:opacity-40 transition-opacity"
        >
          {loading ? "..." : "Refresh"}
        </motion.button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {([
          { label: "Total Runs", value: summary.total, color: "text-primary" },
          { label: "Successful", value: summary.success, color: "text-emerald-400" },
          { label: "Failed", value: summary.error, color: "text-red-400" },
          { label: "In Progress", value: summary.running, color: "text-amber-400" },
        ] as const).map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const statusMap: Record<string, string> = { "Successful": "success", "Failed": "error", "In Progress": "running" };
              const s = statusMap[item.label];
              setFilterStatus(filterStatus === s ? "all" : s ?? "all");
            }}
            className={`glass rounded-xl px-4 py-3 text-left border ${
              (item.label === "Successful" && filterStatus === "success") ||
              (item.label === "Failed" && filterStatus === "error") ||
              (item.label === "In Progress" && filterStatus === "running")
                ? "border-white/20"
                : "border-white/5"
            } transition-colors`}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <div className={`w-2 h-2 rounded-full ${
                item.label === "Total Runs" ? "bg-cyan-400" :
                item.label === "Successful" ? "bg-emerald-400" :
                item.label === "Failed" ? "bg-red-400" : "bg-amber-400"
              }`} />
              <span className="text-[10px] font-medium text-muted uppercase tracking-wider">{item.label}</span>
            </div>
            <motion.div
              key={item.value}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-xl font-bold ${item.color}`}
            >
              {item.value}
            </motion.div>
          </motion.button>
        ))}
      </div>

      {/* Timeline Chart */}
      {chartData.length > 1 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-4 mb-4 border border-white/5"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-semibold text-muted uppercase tracking-wider">Timeline</span>
            <span className="text-[10px] text-muted font-mono">
              {chartData.length} runs · {Math.round(chartSpan / 60000)}m span
            </span>
          </div>
          <div className="relative h-16 flex items-end gap-[1px]">
            {chartData.map((run, idx) => {
              const x = (new Date(run.startedat).getTime() - chartMin) / chartSpan;
              const left = `${x * 100}%`;
              const h = run.duration ? Math.min(run.duration / 50, 60) : 4;
              const color = STATUS_COLORS[run.status].dot;
              return (
                <motion.div
                  key={run.id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: Math.max(h, 4), opacity: 1 }}
                  transition={{ delay: idx * 0.01, duration: 0.3 }}
                  title={`${run.type} - ${run.status} (${run.duration ? (run.duration / 1000).toFixed(1) + 's' : 'running'})`}
                  className="absolute bottom-0 w-[3px] rounded-t-sm cursor-pointer hover:w-[5px] transition-all"
                  style={{
                    left,
                    backgroundColor: color,
                    boxShadow: `0 0 4px ${color}40`,
                  }}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[9px] text-muted font-mono">
              {chartData.length > 0 ? new Date(chartData[0].startedat).toLocaleTimeString() : ""}
            </span>
            <span className="text-[9px] text-muted font-mono">
              {chartData.length > 0 ? new Date(chartData[chartData.length - 1].startedat).toLocaleTimeString() : ""}
            </span>
          </div>
        </motion.div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 pr-2.5 py-1.5 rounded-lg text-[11px] bg-glass border border-white/5 text-primary outline-none focus:border-cyan-500/40 transition-colors w-36"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-2.5 py-1.5 rounded-lg text-[11px] bg-glass border border-white/5 text-primary outline-none focus:border-cyan-500/40 transition-colors"
        >
          <option value="all">All Types</option>
          {types.map((t) => <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>)}
        </select>
        {(filterType !== "all" || filterStatus !== "all" || search) && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => { setFilterType("all"); setFilterStatus("all"); setSearch(""); }}
            className="px-2 py-1.5 rounded-lg text-[10px] text-muted hover:text-primary bg-glass hover:bg-white/5 transition-colors border border-white/5"
          >
            Clear ×
          </motion.button>
        )}
        <div className="flex-1" />
        <span className="text-[10px] text-muted font-mono">{filtered.length} results</span>
      </div>

      <AnimatePresence>
        {err && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 px-4 py-3 rounded-xl text-xs text-red-400 bg-red-500/10 border border-red-500/20"
          >
            {err}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Run Groups */}
      {sortedGroups.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-12 text-center border border-white/5"
        >
          <div className="text-3xl mb-3 opacity-40">⏱</div>
          <p className="text-sm text-muted font-medium">No runs yet</p>
          <p className="text-[11px] text-muted/60 mt-1">Runs will appear here when cron jobs execute or webhooks fire</p>
        </motion.div>
      )}

      <div className="space-y-3">
        {sortedGroups.map(([type, groupRuns]) => {
          const groupStatus = groupRuns.some((r) => r.status === "error") ? "error" :
            groupRuns.some((r) => r.status === "running") ? "running" : "success";
          const latestRun = groupRuns.reduce((latest, r) =>
            new Date(r.startedat).getTime() > new Date(latest.startedat).getTime() ? r : latest
          );
          const maxDuration = Math.max(...groupRuns.map((r) => r.duration ?? 0), 1);

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl overflow-hidden border border-white/5"
            >
              {/* Group Header */}
              <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
                <span className="text-base">{TYPE_ICONS[type] || "⚙"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-primary">{TYPE_LABELS[type] || type}</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${
                      groupStatus === "success" ? "text-emerald-400 bg-emerald-500/10" :
                      groupStatus === "error" ? "text-red-400 bg-red-500/10" :
                      "text-amber-400 bg-amber-500/10"
                    }`}>
                      {groupStatus === "running" && (
                        <motion.span animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1 h-1 rounded-full bg-current" />
                      )}
                      {groupRuns.filter((r) => r.status === "success").length} ok · {groupRuns.filter((r) => r.status === "error").length} err
                    </span>
                  </div>
                  <p className="text-[10px] text-muted font-mono">
                    Latest: {new Date(latestRun.startedat).toLocaleString()}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterType(filterType === type ? "all" : type)}
                  className={`px-2 py-1 rounded text-[9px] font-medium transition-colors border ${
                    filterType === type
                      ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                      : "text-muted hover:text-primary border-white/5 hover:border-white/10"
                  }`}
                >
                  {filterType === type ? "Showing" : "Filter"}
                </motion.button>
              </div>

              {/* Run List */}
              <div className="divide-y divide-white/[0.03]">
                {groupRuns.slice(0, 20).map((run) => {
                  const c = STATUS_COLORS[run.status];
                  const durPct = maxDuration > 0 ? ((run.duration ?? 0) / maxDuration) * 100 : 0;

                  return (
                    <motion.div
                      key={run.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="px-4 py-2.5 hover:bg-white/[0.02] transition-colors relative"
                    >
                      {/* Duration bar bg */}
                      <div className="absolute right-0 top-0 bottom-0 pointer-events-none overflow-hidden rounded-r-xl">
                        <div
                          className="h-full transition-all"
                          style={{
                            width: `${durPct}%`,
                            background: `linear-gradient(90deg, transparent, ${c.dot}08)`,
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-3 relative">
                        {/* Status dot */}
                        <div className="relative flex-shrink-0">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.dot }} />
                          {run.status === "running" && (
                            <motion.div
                              animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              className="absolute inset-0 w-2 h-2 rounded-full"
                              style={{ backgroundColor: c.dot }}
                            />
                          )}
                        </div>

                        {/* Time */}
                        <span className="text-[11px] font-mono text-muted w-16 flex-shrink-0 tabular-nums">
                          {new Date(run.startedat).toLocaleTimeString()}
                        </span>

                        {/* Duration */}
                        <span className="text-[10px] font-mono text-muted/60 w-12 flex-shrink-0 tabular-nums">
                          {run.duration != null ? `${(run.duration / 1000).toFixed(1)}s` : "—"}
                        </span>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          {run.error && (
                            <span className="text-[11px] text-red-400 truncate block" title={run.error}>
                              {run.error.substring(0, 60)}
                            </span>
                          )}
                          {run.metadata?.email && (
                            <span className="text-[11px] text-muted truncate block">
                              To: {run.metadata.email}
                            </span>
                          )}
                          {run.metadata?.count != null && (
                            <span className="text-[11px] text-muted">{run.metadata.count} items</span>
                          )}
                          {!run.error && !run.metadata?.email && run.metadata?.count == null && (
                            <span className="text-[11px] text-muted/40">
                              {run.result ? `${run.type.split(".").pop()} completed` : "No details"}
                            </span>
                          )}
                        </div>

                        {/* Badge */}
                        <span
                          className="px-1.5 py-0.5 rounded text-[9px] font-medium flex-shrink-0"
                          style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
                        >
                          {run.status}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
                {groupRuns.length > 20 && (
                  <div className="px-4 py-2 text-center text-[10px] text-muted/40">
                    +{groupRuns.length - 20} more
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
