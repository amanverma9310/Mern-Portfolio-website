import { useEffect, useState } from "react";
import { FiTrash2, FiSearch, FiX } from "react-icons/fi";
import { api } from "../../services/api";

const FILTERS = ["All", "New", "Read", "Replied", "Archived"];
const statusColors = {
  New: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Read: "bg-white/10 text-white/60 border-white/15",
  Replied: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Archived: "bg-white/5 text-white/30 border-white/10",
};

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  const load = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (filter !== "All") params.set("status", filter);
      if (search.trim()) params.set("search", search.trim());
      const res = await api.get(`/contact?${params.toString()}`);
      setMessages(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    load(1);
  };

  const updateStatus = async (id, status) => {
    const res = await api.patch(`/contact/${id}`, { status });
    setMessages((prev) => prev.map((m) => (m._id === id ? res.data : m)));
    if (selected?._id === id) setSelected(res.data);
  };

  const deleteMessage = async (id) => {
    if (!confirm("Delete this message permanently?")) return;
    await api.delete(`/contact/${id}`);
    setMessages((prev) => prev.filter((m) => m._id !== id));
    if (selected?._id === id) setSelected(null);
  };

  const openMessage = async (msg) => {
    setSelected(msg);
    if (msg.status === "New") {
      updateStatus(msg._id, "Read");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Messages</h1>
      <p className="text-white/40 text-sm mb-6">Contact form submissions from your portfolio.</p>

      <div className="flex flex-wrap items-center gap-2 mb-5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              filter === f
                ? "bg-white text-black border-white"
                : "border-white/15 text-white/60 hover:text-white hover:border-white/30"
            }`}
          >
            {f}
          </button>
        ))}

        <form onSubmit={handleSearchSubmit} className="ml-auto flex items-center gap-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name / email / subject"
              className="bg-white/[0.03] border border-white/10 focus:border-white/30 outline-none rounded-lg py-2 pl-8 pr-3 text-xs text-white placeholder-white/30 w-56"
            />
          </div>
        </form>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs text-white/40">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Email</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Subject</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium hidden sm:table-cell">Date</th>
                <th className="px-4 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-white/30 text-sm">
                    Loading…
                  </td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-white/30 text-sm">
                    No messages found.
                  </td>
                </tr>
              ) : (
                messages.map((m) => (
                  <tr
                    key={m._id}
                    className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer"
                    onClick={() => openMessage(m)}
                  >
                    <td className="px-4 py-3 text-white/85 max-w-[140px] truncate">{m.name}</td>
                    <td className="px-4 py-3 text-white/60 hidden sm:table-cell max-w-[180px] truncate">
                      {m.email}
                    </td>
                    <td className="px-4 py-3 text-white/60 hidden md:table-cell max-w-[220px] truncate">
                      {m.subject}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-medium px-2 py-1 rounded-full border ${
                          statusColors[m.status]
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-white/40 hidden sm:table-cell whitespace-nowrap">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessage(m._id);
                        }}
                        className="text-white/30 hover:text-red-400 transition-colors"
                        aria-label="Delete message"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => load(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                pagination.page === p
                  ? "bg-white text-black"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0c0d10] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white">{selected.subject}</h3>
                <p className="text-xs text-white/40 mt-1">
                  {selected.name} · {selected.email}
                </p>
              </div>
              <button onClick={() => setSelected(null)} className="text-white/40 hover:text-white">
                <FiX size={18} />
              </button>
            </div>

            <p className="text-sm text-white/70 whitespace-pre-wrap leading-relaxed mb-5">
              {selected.message}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              {FILTERS.filter((f) => f !== "All").map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(selected._id, s)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                    selected.status === s
                      ? "bg-white text-black border-white"
                      : "border-white/15 text-white/60 hover:text-white hover:border-white/30"
                  }`}
                >
                  {s}
                </button>
              ))}
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(
                  "Re: " + selected.subject
                )}`}
                className="ml-auto text-xs text-blue-400 hover:text-blue-300"
              >
                Reply by email →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
