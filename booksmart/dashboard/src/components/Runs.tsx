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

interface RunResponse {
  runs: CronRun[];
  summary: { total: number; success: number; failed: number; running: number; successRate: string };
  recentFailures: CronRun[];
  byType: Record<string, number>;
  byStatus: { success: number; failed: number; running: number };
}

const TYPE_LABELS: Record<string, string> = {
  "cron.process-sequence": "Process Sequence",
  "cron.check-replies": "Check Replies",
  "cron.sync-leads": "Sync Leads",
  "webhook.form": "Form Submission",
  "webhook.booking": "Booking",
  "webhook.payment": "Payment",
  "webhook.missed-call": "Missed Call",
};

function formatDuration(ms: number | null): string {
  if (ms == null) return "—";
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function Runs() {
  const [data, setData] = useState<RunResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const r = await fetch("/api/runs?limit=100");
      if (!r.ok) throw new Error(`Runs: ${r.status}`);
      setData(await r.json());
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { const i = setInterval(load, 15000); return () => clearInterval(i); }, [load]);

  if (!data) {
    return (
      <div className="flex items-center justify-center" style={{ height: "60vh" }}>
        <div className="text-center">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-6 rounded-full bg-indigo-500/30 mx-auto mb-4"
          />
          <p className="text-sm text-[#A3AAB8]">Loading...</p>
        </div>
      </div>
    );
  }

  const { runs, summary, recentFailures, byType, byStatus } = data;
  const types = Object.keys(byType).sort();

  const filtered = runs.filter((r) => {
    if (filterType !== "all" && r.type !== filterType) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.id?.toLowerCase().includes(q) && !(TYPE_LABELS[r.type] || r.type).toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const queueTotal = Math.max(runs.length, 1);

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 32px" }}>
      {/* ===== HEADER ===== */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#818CF8] to-[#6366F1] flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-500/25">
              B
            </div>
            <span className="text-[11px] font-medium text-[#A3AAB8] tracking-wide">BookSmart</span>
            <span className="text-[#A3AAB8]/30">/</span>
            <span className="text-[11px] font-medium text-[#F5F7FA]">Automation Monitoring</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F5F7FA] tracking-tight mb-1.5">Run Logs</h1>
          <p className="text-sm text-[#A3AAB8] max-w-xl">
            Monitor execution health, failures, processing activity, and automation performance in real time.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={load}
            disabled={loading}
            className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#F5F7FA] bg-[#6366F1] hover:bg-[#5558E6] disabled:opacity-40 transition-all shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
            <motion.span
              animate={loading ? { rotate: 360 } : { rotate: 0 }}
              transition={loading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
              className="inline-block text-sm"
            >
              ↻
            </motion.span>
            {loading ? "Refreshing..." : "Refresh"}
          </motion.button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shadow-lg">
            C
          </div>
        </div>
      </div>

      {/* ===== OVERVIEW METRICS ===== */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Runs", value: summary.total.toLocaleString(), color: "#F5F7FA", sub: null },
          { label: "Successful", value: summary.success.toLocaleString(), color: "#22C55E", sub: "+4.2%" },
          { label: "Failed", value: summary.failed.toLocaleString(), color: "#EF4444", sub: "-1.1%" },
          { label: "Success Rate", value: `${summary.successRate}%`, color: "#6366F1", sub: null },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            whileHover={{ y: -2 }}
            className="rounded-[20px] border border-white/[0.06] transition-all duration-200"
            style={{ background: "#0F1115", padding: 24 }}
          >
            <p className="text-[13px] font-medium text-[#A3AAB8] mb-2">{card.label}</p>
            <div className="flex items-end gap-3">
              <motion.span
                key={card.value}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[42px] font-bold leading-none tracking-tight"
                style={{ color: card.color }}
              >
                {card.value}
              </motion.span>
              {card.sub && (
                <span
                  className={`text-[13px] font-medium mb-1.5 ${card.sub.startsWith("+") ? "text-[#22C55E]" : "text-[#EF4444]"}`}
                >
                  {card.sub}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ===== TOOLBAR ===== */}
      <div
        className="flex items-center gap-3 mb-6 rounded-xl border border-white/[0.06] px-4"
        style={{ background: "#0F1115", height: 48 }}
      >
        <svg className="w-4 h-4 text-[#A3AAB8] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search by ID or workflow..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-[13px] text-[#F5F7FA] outline-none placeholder:text-[#A3AAB8]/50 h-full"
        />
        <div className="w-px h-5 bg-white/[0.06]" />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-transparent text-[13px] text-[#A3AAB8] outline-none cursor-pointer"
        >
          <option value="all">All workflows</option>
          {types.map((t) => <option key={t} value={t}>{TYPE_LABELS[t] || t}</option>)}
        </select>
        <div className="w-px h-5 bg-white/[0.06]" />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-transparent text-[13px] text-[#A3AAB8] outline-none cursor-pointer"
        >
          <option value="all">All status</option>
          <option value="success">Success</option>
          <option value="error">Failed</option>
          <option value="running">Running</option>
        </select>
        <div className="flex-1" />
        <span className="text-[12px] text-[#A3AAB8] font-medium tabular-nums">
          {filtered.length} results
        </span>
      </div>

      {/* ===== MAIN CONTENT: 70/30 ===== */}
      <div className="grid grid-cols-[1fr_340px] gap-6 mb-8">

        {/* LEFT COLUMN — Run History */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[13px] font-semibold text-[#F5F7FA] tracking-wide">Run History</h2>
            <span className="text-[11px] text-[#A3AAB8] font-mono">
              {filtered.length} of {summary.total}
            </span>
          </div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-white/[0.06] px-6 py-12 text-center"
              style={{ background: "#0F1115" }}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <p className="text-sm font-medium text-[#F5F7FA] mb-1">No execution activity yet</p>
              <p className="text-[13px] text-[#A3AAB8] mb-4">
                Run history will appear here once workflows begin processing.
              </p>
              <button className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#F5F7FA] bg-[#6366F1] hover:bg-[#5558E6] transition-colors">
                View Documentation →
              </button>
            </motion.div>
          )}

          {/* Compact Table Header */}
          {filtered.length > 0 && (
            <div className="flex items-center gap-3 px-4 py-2 mb-1 text-[11px] font-medium text-[#A3AAB8]/50 uppercase tracking-wider">
              <span className="w-2.5" />
              <span className="w-32">Workflow</span>
              <span className="w-20">Run ID</span>
              <span className="w-14">Duration</span>
              <span className="flex-1">Status</span>
              <span>Time</span>
            </div>
          )}

          <div className="space-y-0.5">
            <AnimatePresence>
              {filtered.map((run, idx) => (
                <motion.div
                  key={run.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.005 }}
                  className="group flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-white/[0.02] transition-colors"
                >
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor:
                          run.status === "success" ? "#22C55E" :
                          run.status === "error" ? "#EF4444" : "#F59E0B",
                      }}
                    />
                  </div>

                  <span className="text-[13px] text-[#F5F7FA] w-32 truncate flex-shrink-0">
                    {TYPE_LABELS[run.type] || run.type}
                  </span>

                  <span className="text-[11px] font-mono text-[#A3AAB8]/40 w-20 truncate flex-shrink-0">
                    {run.id?.substring(0, 8)}
                  </span>

                  <span className="text-[12px] font-mono text-[#A3AAB8]/60 w-14 flex-shrink-0 tabular-nums">
                    {formatDuration(run.duration)}
                  </span>

                  <div className="flex-1 min-w-0">
                    {run.error ? (
                      <span className="text-[12px] text-red-400 truncate block" title={run.error}>
                        {run.error.substring(0, 40)}
                      </span>
                    ) : (
                      <span className="text-[12px] text-[#A3AAB8]/60">
                        {run.status === "success" ? "Completed" : "Processing..."}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] text-[#A3AAB8]/50 font-mono flex-shrink-0 tabular-nums">
                    {timeAgo(run.startedat)}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN — System Health */}
        <div className="space-y-4">

          {/* Live Status */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-white/[0.06] p-5"
            style={{ background: "#0F1115" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-2 h-2 rounded-full bg-[#22C55E]"
              />
              <span className="text-[11px] font-semibold text-[#22C55E] tracking-wide uppercase">Live</span>
            </div>
            <p className="text-sm font-semibold text-[#F5F7FA] mb-0.5">All Systems Operational</p>
            <p className="text-[12px] text-[#A3AAB8]">
              {summary.running > 0
                ? `${summary.running} execution${summary.running > 1 ? "s" : ""} in progress`
                : "No active executions"}
            </p>
          </motion.div>

          {/* Queue Activity */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="rounded-xl border border-white/[0.06] p-5"
            style={{ background: "#0F1115" }}
          >
            <h3 className="text-[11px] font-semibold text-[#A3AAB8] uppercase tracking-wide mb-4">Queue Activity</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-[#A3AAB8]">Running</span>
                  <span className="text-[12px] font-medium text-[#F5F7FA] tabular-nums">{byStatus.running}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(byStatus.running / queueTotal) * 100}%` }}
                    className="h-full rounded-full bg-[#F59E0B]"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-[#A3AAB8]">Completed</span>
                  <span className="text-[12px] font-medium text-[#F5F7FA] tabular-nums">{byStatus.success}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(byStatus.success / Math.max(runs.length, 1)) * 100}%` }}
                    className="h-full rounded-full bg-[#22C55E]"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12px] text-[#A3AAB8]">Failed</span>
                  <span className="text-[12px] font-medium text-[#F5F7FA] tabular-nums">{byStatus.failed}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(byStatus.failed / Math.max(runs.length, 1)) * 100}%` }}
                    className="h-full rounded-full bg-[#EF4444]"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Execution Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl border border-white/[0.06] p-5"
            style={{ background: "#0F1115" }}
          >
            <h3 className="text-[11px] font-semibold text-[#A3AAB8] uppercase tracking-wide mb-4">Distribution</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-28 h-28">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  {(() => {
                    const t = runs.length || 1;
                    const slices = [
                      { pct: byStatus.success / t, color: "#22C55E" },
                      { pct: byStatus.failed / t, color: "#EF4444" },
                      { pct: byStatus.running / t, color: "#F59E0B" },
                    ];
                    let offset = 0;
                    return slices.map((s, i) => {
                      const circumference = 2 * Math.PI * 13;
                      const dash = s.pct * circumference;
                      const gap = circumference - dash;
                      const el = (
                        <circle
                          key={i}
                          cx="18"
                          cy="18"
                          r="13"
                          fill="none"
                          stroke={s.color}
                          strokeWidth="3"
                          strokeDasharray={`${dash} ${gap}`}
                          strokeDashoffset={-offset}
                          opacity={s.pct > 0 ? 1 : 0}
                        />
                      );
                      offset += dash;
                      return el;
                    });
                  })()}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-[#F5F7FA]">{summary.successRate}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              {[
                { label: "Success", count: byStatus.success, color: "#22C55E" },
                { label: "Failed", count: byStatus.failed, color: "#EF4444" },
                { label: "Running", count: byStatus.running, color: "#F59E0B" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-[12px]">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#A3AAB8] flex-1">{item.label}</span>
                  <span className="font-medium text-[#F5F7FA] tabular-nums">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== RECENT FAILURES ===== */}
      {recentFailures.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-white/[0.06] overflow-hidden mb-8"
          style={{ background: "#0F1115" }}
        >
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <h2 className="text-[13px] font-semibold text-[#F5F7FA]">Recent Failures</h2>
            </div>
            <span className="text-[11px] text-[#A3AAB8]">
              {recentFailures.length} failed execution{recentFailures.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {recentFailures.map((run, idx) => (
              <motion.div
                key={run.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.02 }}
                className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-2 h-2 rounded-full bg-[#EF4444] flex-shrink-0" />
                <span className="text-[13px] font-medium text-[#F5F7FA] w-32 truncate flex-shrink-0">
                  {TYPE_LABELS[run.type] || run.type}
                </span>
                <span className="text-[12px] text-red-400 truncate flex-1" title={run.error ?? ""}>
                  {run.error?.substring(0, 50) || "Unknown error"}
                </span>
                <span className="text-[11px] text-[#A3AAB8] font-mono flex-shrink-0">
                  {timeAgo(run.startedat)}
                </span>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium text-[#F5F7FA] bg-white/[0.08] hover:bg-white/[0.12] transition-colors flex-shrink-0"
                >
                  Retry
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
