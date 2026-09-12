import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiSun,
  FiMail,
  FiInbox,
  FiDownload,
  FiEye,
} from "react-icons/fi";
import { api } from "../../services/api";

function StatCard({ icon: Icon, label, value, loading }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium tracking-wide text-white/40">{label}</span>
        <Icon size={16} className="text-white/30" />
      </div>
      <div className="text-2xl font-bold text-white">
        {loading ? <span className="text-white/20">—</span> : value}
      </div>
    </div>
  );
}

const statusColors = {
  New: "bg-blue-500/15 text-blue-300",
  Read: "bg-white/10 text-white/60",
  Replied: "bg-emerald-500/15 text-emerald-300",
  Archived: "bg-white/5 text-white/30",
};

export default function DashboardHome() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    api
      .get("/analytics/overview")
      .then((res) => mounted && setOverview(res.data))
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-white/40 text-sm mb-6">Live data from your portfolio's MongoDB.</p>

      {error && (
        <p className="mb-6 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          Couldn't load stats: {error}
        </p>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard icon={FiUsers} label="Total Visitors" value={overview?.totalVisitors ?? 0} loading={loading} />
        <StatCard icon={FiSun} label="Today's Visitors" value={overview?.todaysVisitors ?? 0} loading={loading} />
        <StatCard icon={FiMail} label="Contact Messages" value={overview?.totalMessages ?? 0} loading={loading} />
        <StatCard icon={FiInbox} label="New Messages" value={overview?.newMessages ?? 0} loading={loading} />
        <StatCard icon={FiDownload} label="Resume Downloads" value={overview?.resumeDownloads ?? 0} loading={loading} />
        <StatCard icon={FiEye} label="Project Views" value={overview?.totalProjectViews ?? 0} loading={loading} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent messages */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/80">Recent Messages</h2>
            <Link to="/admin/dashboard/messages" className="text-xs text-white/40 hover:text-white">
              View all →
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-white/30">Loading…</p>
          ) : !overview?.recentMessages?.length ? (
            <p className="text-sm text-white/30">No messages yet.</p>
          ) : (
            <div className="space-y-3">
              {overview.recentMessages.map((m) => (
                <div key={m._id} className="flex items-center justify-between gap-3 text-sm">
                  <div className="min-w-0">
                    <div className="text-white/85 truncate">{m.name}</div>
                    <div className="text-white/40 text-xs truncate">{m.subject}</div>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-medium px-2 py-1 rounded-full ${
                      statusColors[m.status] || "bg-white/10 text-white/50"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Most viewed projects */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white/80">Most Viewed Projects</h2>
            <Link to="/admin/dashboard/projects" className="text-xs text-white/40 hover:text-white">
              Manage →
            </Link>
          </div>

          {loading ? (
            <p className="text-sm text-white/30">Loading…</p>
          ) : !overview?.mostViewedProjects?.length ? (
            <p className="text-sm text-white/30">No project views yet.</p>
          ) : (
            <div className="space-y-3">
              {overview.mostViewedProjects.map((p) => (
                <div key={p._id} className="flex items-center justify-between text-sm">
                  <span className="text-white/85 truncate">{p.title}</span>
                  <span className="text-white/40">{p.views} views</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
