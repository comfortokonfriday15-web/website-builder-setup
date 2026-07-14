import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CronRun {
  id: string;
  type: string;
  status: "success" | "error" | "running";
  startedAt: string;
  finishedAt: string | null;
  durationMs: number | null;
  metadata: any;
  error: string | null;
}

type SortKey = "startedAt" | "type" | "status" | "durationMs";

export default function Runs({ onNavigate }: { onNavigate: () => void }) {
  const [runs, setRuns] = useState<CronRun[]>([]);
  const [summary, setSummary] = useState({ total: 0, success: 0, error: 0, running: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("startedAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/runs?limit=200");
      if (!r.ok) throw new Error(`Runs: ${r.status}`);
      const data = await r.json();
      setRuns(data.runs ?? []);
      setSummary(data.summary ?? { total: 0, success: 0, error: 0, running: 0 });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const interval = setInterval(load, 15_000);
    return () => clearInterval(interval);
  }, [load]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  };

  const types = [...new Set(runs.map((r) => r.type))].sort();
  const filtered = runs.filter((r) => {
    if (filterType !== "all" && r.type !== filterType) return false;
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "startedAt") cmp = a.startedAt.localeCompare(b.startedAt);
    else if (sortKey === "type") cmp = a.type.localeCompare(b.type);
    else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
    else if (sortKey === "durationMs") cmp = (a.durationMs ?? 0) - (b.durationMs ?? 0);
    return sortDir === "asc" ? cmp : -cmp;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="w-1 h-5 rounded-full bg-gradient-to-b from-[#22D3EE] to-[#06B6D4]" />
          <h2 className="text-sm font-semibold text-primary uppercase tracking-widest">
            Run Logs
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted">
            <span className="inline-block w-2 h-2 rounded-full bg-[#22C55E]" />
            {summary.success} ok
            <span className="inline-block w-2 h-2 rounded-full bg-[#EF4444]" />
            {summary.error} err
            <span className="inline-block w-2 h-2 rounded-full bg-[#F59E0B]" />
            {summary.running} running
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={onNavigate}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted hover:text-primary bg-glass hover:bg-glass-hover transition-colors"
          >
            ← Dashboard
          </motion.button>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="glass rounded-lg px-3 py-2">
          <div className="text-lg font-bold text-primary">{summary.total}</div>
          <div className="text-[10px] text-muted uppercase tracking-wider">Total Runs</div>
        </div>
        <div
          className="glass rounded-lg px-3 py-2 cursor-pointer"
          onClick={() => setFilterStatus(filterStatus === "success" ? "all" : "success")}
        >
          <div className="text-lg font-bold text-[#22C55E]">{summary.success}</div>
          <div className="text-[10px] text-muted uppercase tracking-wider">Success</div>
        </div>
        <div
          className="glass rounded-lg px-3 py-2 cursor-pointer"
          onClick={() => setFilterStatus(filterStatus === "error" ? "all" : "error")}
        >
          <div className="text-lg font-bold text-[#EF4444]">{summary.error}</div>
          <div className="text-[10px] text-muted uppercase tracking-wider">Errors</div>
        </div>
        <div
          className="glass rounded-lg px-3 py-2 cursor-pointer"
          onClick={() => setFilterStatus(filterStatus === "running" ? "all" : "running")}
        >
          <div className="text-lg font-bold text-[#F59E0B]">{summary.running}</div>
          <div className="text-[10px] text-muted uppercase tracking-wider">Running</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-2 py-1 rounded text-xs bg-glass border border-glass-border text-primary outline-none focus:border-[#6366F1]"
        >
          <option value="all">All types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search metadata..."
          className="px-2 py-1 rounded text-xs bg-glass border border-glass-border text-primary outline-none focus:border-[#6366F1] flex-1 min-w-[160px]"
          onChange={(e) => {
            const q = e.target.value.toLowerCase();
            if (!q) return setRuns(runs);
            setRuns(runs.filter((r) => JSON.stringify(r.metadata).toLowerCase().includes(q)));
          }}
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 px-3 py-2 rounded-lg text-xs text-danger bg-danger border border-danger"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-glass-border">
                {(["type", "status", "startedAt", "durationMs"] as SortKey[]).map((key) => (
                  <th
                    key={key}
                    className="text-left px-3 py-2 text-muted font-semibold uppercase tracking-wider cursor-pointer hover:text-primary transition-colors"
                    onClick={() => toggleSort(key)}
                  >
                    {key === "startedAt" ? "Started" : key === "durationMs" ? "Duration" : key}
                    {sortKey === key && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                  </th>
                ))}
                <th className="text-left px-3 py-2 text-muted font-semibold uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {sorted.map((run) => (
                  <motion.tr
                    key={run.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-b border-glass-border last:border-0 hover:bg-glass-hover transition-colors"
                  >
                    <td className="px-3 py-2 text-primary whitespace-nowrap">
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-glass border border-glass-border">
                        {run.type}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                          run.status === "success"
                            ? "text-[#22C55E]"
                            : run.status === "error"
                            ? "text-[#EF4444]"
                            : "text-[#F59E0B]"
                        }`}
                      >
                        {run.status === "running" && (
                          <motion.span
                            animate={{ opacity: [1, 0.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="inline-block w-1.5 h-1.5 rounded-full bg-current"
                          />
                        )}
                        {run.status}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-muted whitespace-nowrap font-mono">
                      {new Date(run.startedAt).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-muted whitespace-nowrap font-mono">
                      {run.durationMs != null ? `${(run.durationMs / 1000).toFixed(1)}s` : "—"}
                    </td>
                    <td className="px-3 py-2 text-muted max-w-[300px] truncate">
                      {run.error && (
                        <span className="text-[#EF4444]" title={run.error}>
                          {run.error.substring(0, 80)}
                        </span>
                      )}
                      {run.metadata?.email && (
                        <span title={`To: ${run.metadata.email}`}>
                          📧 {run.metadata.email}
                        </span>
                      )}
                      {run.metadata?.count != null && (
                        <span> ({run.metadata.count} items)</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        {sorted.length === 0 && (
          <div className="px-4 py-8 text-center text-muted text-sm">
            No runs found.
          </div>
        )}
      </div>

      {loading && (
        <div className="text-center text-muted text-xs mt-3">
          Refreshing...
        </div>
      )}
    </div>
  );
}
