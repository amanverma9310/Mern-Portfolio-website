import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { api } from "../../services/api";
import { AVAILABLE_ICON_KEYS, getIcon } from "../../utils/iconMap";

const emptyForm = { name: "", iconKey: "SiReact", color: "#61DAFB", bg: "", sections: ["arsenal"], order: 0 };

export default function SkillsAdmin() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/skills")
      .then((res) => setSkills(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(emptyForm);
    setFormError("");
    setEditing("new");
  };

  const openEdit = (s) => {
    setForm({
      name: s.name,
      iconKey: s.iconKey,
      color: s.color,
      bg: s.bg || "",
      sections: s.sections,
      order: s.order,
    });
    setFormError("");
    setEditing(s);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const toggleSection = (section) => {
    setForm((f) => ({
      ...f,
      sections: f.sections.includes(section)
        ? f.sections.filter((s) => s !== section)
        : [...f.sections, section],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (form.sections.length === 0) {
      setFormError("Select at least one section (Marquee and/or Arsenal).");
      return;
    }
    setSaving(true);

    const payload = { ...form, order: Number(form.order) || 0 };

    try {
      if (editing === "new") {
        const res = await api.post("/skills", payload);
        setSkills((prev) => [...prev, res.data].sort((a, b) => a.order - b.order));
      } else {
        const res = await api.put(`/skills/${editing._id}`, payload);
        setSkills((prev) => prev.map((s) => (s._id === editing._id ? res.data : s)));
      }
      setEditing(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this skill?")) return;
    await api.delete(`/skills/${id}`);
    setSkills((prev) => prev.filter((s) => s._id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Skills</h1>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-white text-black text-xs font-semibold px-3 py-2 hover:bg-white/90 transition-colors"
        >
          <FiPlus size={14} /> Add Skill
        </button>
      </div>
      <p className="text-white/40 text-sm mb-6">
        Drives the tech marquee and the "Arsenal" list in the About section.
      </p>

      {error && (
        <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading ? (
          <p className="text-sm text-white/30 col-span-full">Loading…</p>
        ) : skills.length === 0 ? (
          <p className="text-sm text-white/30 col-span-full">No skills yet.</p>
        ) : (
          skills.map((s) => {
            const Icon = getIcon(s.iconKey);
            return (
              <div
                key={s._id}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3"
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 shrink-0"
                  style={{ backgroundColor: s.bg || "#0f1114" }}
                >
                  <Icon size={18} color={s.color} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-white truncate">{s.name}</div>
                  <div className="text-[10px] text-white/30">{s.sections.join(" + ")}</div>
                </div>
                <button onClick={() => openEdit(s)} className="text-white/40 hover:text-white shrink-0">
                  <FiEdit2 size={14} />
                </button>
                <button onClick={() => remove(s._id)} className="text-white/40 hover:text-red-400 shrink-0">
                  <FiTrash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-xl border border-white/10 bg-[#0c0d10] p-6 my-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white">{editing === "new" ? "Add Skill" : "Edit Skill"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-white/40 hover:text-white">
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Name">
                <input name="name" value={form.name} onChange={handleChange} required className={inputClass} />
              </Field>
              <Field label="Icon">
                <select name="iconKey" value={form.iconKey} onChange={handleChange} className={inputClass}>
                  {AVAILABLE_ICON_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {key}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Color (hex)">
                  <input name="color" value={form.color} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Marquee background (optional)">
                  <input name="bg" value={form.bg} onChange={handleChange} className={inputClass} />
                </Field>
              </div>
              <Field label="Show in">
                <div className="flex gap-4">
                  {["marquee", "arsenal"].map((section) => (
                    <label key={section} className="flex items-center gap-2 text-sm text-white/70">
                      <input
                        type="checkbox"
                        checked={form.sections.includes(section)}
                        onChange={() => toggleSection(section)}
                        className="accent-white"
                      />
                      {section === "marquee" ? "Tech Marquee" : "Arsenal"}
                    </label>
                  ))}
                </div>
              </Field>
              <Field label="Order">
                <input type="number" name="order" value={form.order} onChange={handleChange} className={inputClass} />
              </Field>
            </div>

            {formError && <p className="text-sm text-red-400 mt-4">{formError}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-5 rounded-lg bg-white text-black font-semibold text-sm py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Skill"}
            </button>
          </form>
        </div>
      )}
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
