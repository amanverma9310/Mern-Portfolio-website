import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiLock } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.username.trim(), form.password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0d] text-white flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-white/[0.06] border border-white/15 flex items-center justify-center mb-4">
            <FiLock className="text-white/70" size={18} />
          </div>
          <h1 className="text-xl font-bold">Admin Login</h1>
          <p className="text-white/40 text-sm mt-1">Portfolio dashboard access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs text-white/50 mb-2">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              required
              className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 outline-none rounded-lg py-2.5 px-3 text-sm text-white placeholder-white/30 transition-colors"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
              className="w-full bg-white/[0.03] border border-white/10 focus:border-white/30 outline-none rounded-lg py-2.5 px-3 text-sm text-white placeholder-white/30 transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-white text-black font-semibold text-sm py-3 hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
