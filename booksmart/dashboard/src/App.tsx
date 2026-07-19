import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "./components/Header";
import MetricCard from "./components/MetricCard";
import Pipeline from "./components/Pipeline";
import ActivityFeed from "./components/ActivityFeed";
import TodayQueue from "./components/TodayQueue";
import CampaignHealth from "./components/CampaignHealth";
import OpenedLeads from "./components/OpenedLeads";
import Runs from "./components/Runs";
import type { StatsResponse, ActivityEvent } from "./types";

function formatDollar(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
}

export default function App() {
  const [view, setView] = useState<"dashboard" | "runs">("dashboard");
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, a] = await Promise.all([
        fetch("/api/stats").then((r) => { if (!r.ok) throw new Error(`Stats: ${r.status}`); return r.json(); }),
        fetch("/api/recent").then((r) => { if (!r.ok) throw new Error(`Recent: ${r.status}`); return r.json(); }),
      ]);
      setStats(s as StatsResponse);
      setActivity((a as { events: ActivityEvent[] }).events || []);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="max-w-1280 mx-auto p-6">
      <Header onRefresh={load} loading={loading} view={view} onViewChange={setView} />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-6 px-4 py-3 rounded-lg text-sm text-danger bg-danger border-danger"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === "runs" && (
          <motion.div
            key="runs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Runs />
          </motion.div>
        )}

        {view === "dashboard" && stats && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* North Star */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#818CF8] to-[#6366F1]" />
                <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">
                  North Star Metrics
                </h2>
              </div>
              <div className="grid grid-cols-2 lg-grid-cols-4 gap-2">
                <MetricCard
                  label="Emails Sent Today"
                  value={stats.northStar.emailsSentToday.current}
                  progress={stats.northStar.emailsSentToday}
                  delay={0}
                />
                <MetricCard
                  label="Positive Replies"
                  value={stats.northStar.positiveReplies}
                  accent
                  footer={
                    stats.northStar.replyRateChange > 0
                      ? `↑ +${stats.northStar.replyRateChange}% vs last month`
                      : stats.northStar.replyRateChange < 0
                      ? `↓ ${stats.northStar.replyRateChange}% vs last month`
                      : "No change vs last month"
                  }
                  delay={0.05}
                />
                <MetricCard
                  label="Reply Rate"
                  value={stats.northStar.replyRate}
                  format={(n) => `${n}%`}
                  footer="Reply rate"
                  delay={0.1}
                />
                <MetricCard
                  label="Calls Booked"
                  value={stats.northStar.callsBooked}
                  success
                  footer="Most important metric"
                  delay={0.15}
                />
              </div>
            </div>

            {/* Momentum */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#4ADE80] to-[#22C55E]" />
                <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">
                  Momentum
                </h2>
              </div>
              <div className="grid grid-cols-2 lg-grid-cols-5 gap-2">
                <MetricCard label="Concept Requests" value={stats.momentum.conceptRequests} small delay={0.1} />
                <MetricCard label="Concepts Delivered" value={stats.momentum.conceptsDelivered} small delay={0.15} />
                <MetricCard label="Testimonials" value={stats.momentum.testimonialsReceived} small delay={0.2} />
                <MetricCard
                  label="Pipeline Value"
                  value={stats.momentum.pipelineValue}
                  format={formatDollar}
                  small
                  delay={0.25}
                />
                <MetricCard label="Total Leads" value={stats.leads.total} small delay={0.3} />
              </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg-grid-cols-main gap-6">
              <div>
                {/* Pipeline */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#F59E0B] to-[#D97706]" />
                    <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">
                      Pipeline Overview
                    </h2>
                  </div>
                  <div className="glass rounded-xl p-2">
                    <Pipeline stages={stats.pipeline} />
                  </div>
                </div>

                {/* Activity */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#22C55E] to-[#16A34A]" />
                    <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">
                      Recent Activity
                    </h2>
                  </div>
                  <div className="glass rounded-xl overflow-hidden">
                    <ActivityFeed events={activity} />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-3">
                <div className="glass rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                    Today's Queue
                  </h3>
                  <TodayQueue queue={stats.todayQueue} />
                </div>
                <div className="glass rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                    Campaign Health
                  </h3>
                  <CampaignHealth health={stats.campaignHealth} />
                </div>
                <div className="glass rounded-xl p-4">
                  <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
                    Who Opened
                  </h3>
                  <OpenedLeads leads={stats.campaignHealth.openedLeads} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
