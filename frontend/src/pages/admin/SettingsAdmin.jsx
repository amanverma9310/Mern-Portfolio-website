import { useEffect, useState } from "react";
import { api } from "../../services/api";

export default function SettingsAdmin() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/settings/admin")
      .then((res) => setForm(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, socialLinks: { ...f.socialLinks, [name]: value } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await api.put("/settings", form);
      setForm(res.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-sm text-white/30">Loading…</p>;
  if (!form) return <p className="text-sm text-red-400">{error || "Couldn't load settings."}</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-white/40 text-sm mb-6">
        Sensitive credentials (DB, JWT, email) live only in backend/.env — never here.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Owner name">
          <input name="ownerName" value={form.ownerName} onChange={handleChange} className={inputClass} />
        </Field>
        <Field label="Public contact email">
          <input
            type="email"
            name="contactEmail"
            value={form.contactEmail}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>
        <Field label="Resume URL">
          <input
            name="resumeUrl"
            value={form.resumeUrl}
            onChange={handleChange}
            placeholder="https://... link to your hosted PDF resume"
            className={inputClass}
          />
        </Field>
        <Field label="GitHub URL">
          <input name="github" value={form.socialLinks.github} onChange={handleSocialChange} className={inputClass} />
        </Field>
        <Field label="LinkedIn URL">
          <input
            name="linkedin"
            value={form.socialLinks.linkedin}
            onChange={handleSocialChange}
            className={inputClass}
          />
        </Field>
        <Field label="Twitter / X URL (optional)">
          <input
            name="twitter"
            value={form.socialLinks.twitter}
            onChange={handleSocialChange}
            className={inputClass}
          />
        </Field>

        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            name="emailNotificationsEnabled"
            checked={form.emailNotificationsEnabled}
            onChange={handleChange}
            className="accent-white"
          />
          Email me when a new contact message arrives
        </label>

        {error && <p className="text-sm text-red-400">{error}</p>}
        {saved && <p className="text-sm text-emerald-400">Settings saved.</p>}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-white text-black font-semibold text-sm px-5 py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full bg-white/[0.03] border border-white/10 focus:border-white/30 outline-none rounded-lg py-2 px-3 text-sm text-white placeholder-white/30 transition-colors";

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-white/50 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
