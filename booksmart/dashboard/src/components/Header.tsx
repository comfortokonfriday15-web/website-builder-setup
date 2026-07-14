import { motion } from "framer-motion";

interface Props {
  onRefresh: () => void;
  loading: boolean;
  view: "dashboard" | "runs";
  onViewChange: (v: "dashboard" | "runs") => void;
}

export default function Header({ onRefresh, loading, view, onViewChange }: Props) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between mb-8 gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#818CF8] to-[#6366F1] flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-indigo-500/25">
          B
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-primary">
            BookSmart
          </h1>
          <p className="text-xs text-muted font-medium tracking-wide uppercase -mt-0.5">
            Acquisition Operating System
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onViewChange(view === "dashboard" ? "runs" : "dashboard")}
          className="px-3 py-2 rounded-lg text-xs font-medium text-muted hover:text-primary bg-glass hover:bg-glass-hover transition-colors"
        >
          {view === "dashboard" ? "📊 Monitor" : "📈 Dashboard"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={onRefresh}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-[#6366F1] to-[#4F46E5] shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 disabled:opacity-40 transition-shadow flex items-center gap-2"
        >
          <motion.span
            animate={loading ? { rotate: 360 } : { rotate: 0 }}
            transition={loading ? { repeat: Infinity, duration: 1, ease: "linear" } : {}}
            className="inline-block"
          >
            ↻
          </motion.span>
          Refresh
        </motion.button>
      </div>
    </motion.header>
  );
}
