import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiX } from "react-icons/fi";
import { api } from "../../services/api";

const emptyForm = {
  title: "",
  description: "",
  image: "",
  tags: "",
  features: "",
  liveUrl: "",
  codeUrl: "",
  featured: false,
  order: 0,
};

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState(null); // project object or "new" or null
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/projects")
      .then((res) => setProjects(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openNew = () => {
    setForm(emptyForm);
    setFormError("");
    setEditing("new");
  };

  const openEdit = (p) => {
    setForm({
      title: p.title,
      description: p.description,
      image: p.image,
      tags: (p.tags || []).join(", "),
      features: (p.features || []).join("\n"),
      liveUrl: p.liveUrl || "",
      codeUrl: p.codeUrl || "",
      featured: p.featured,
      order: p.order,
    });
    setFormError("");
    setEditing(p);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      image: form.image.trim(),
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      features: form.features.split("\n").map((t) => t.trim()).filter(Boolean),
      liveUrl: form.liveUrl.trim(),
      codeUrl: form.codeUrl.trim(),
      featured: form.featured,
      order: Number(form.order) || 0,
    };

    try {
      if (editing === "new") {
        const res = await api.post("/projects", payload);
        setProjects((prev) => [...prev, res.data].sort((a, b) => a.order - b.order));
      } else {
        const res = await api.put(`/projects/${editing._id}`, payload);
        setProjects((prev) => prev.map((p) => (p._id === editing._id ? res.data : p)));
      }
      setEditing(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this project? This can't be undone.")) return;
    await api.delete(`/projects/${id}`);
    setProjects((prev) => prev.filter((p) => p._id !== id));
  };

  const toggleFeatured = async (p) => {
    const res = await api.put(`/projects/${p._id}`, { featured: !p.featured });
    setProjects((prev) => prev.map((x) => (x._id === p._id ? res.data : x)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-white text-black text-xs font-semibold px-3 py-2 hover:bg-white/90 transition-colors"
        >
          <FiPlus size={14} /> Add Project
        </button>
      </div>
      <p className="text-white/40 text-sm mb-6">
        These are shown live on your portfolio's Projects section, in order.
      </p>

      {error && (
        <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-white/30">Loading…</p>
        ) : projects.length === 0 ? (
          <p className="text-sm text-white/30">No projects yet — add your first one.</p>
        ) : (
          projects.map((p) => (
            <div
              key={p._id}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <img
                src={p.image}
                alt={p.title}
                className="w-16 h-16 rounded-lg object-cover border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white truncate">{p.title}</h3>
                  {p.featured && (
                    <FiStar size={12} className="text-amber-400 shrink-0" fill="currentColor" />
                  )}
                </div>
                <p className="text-xs text-white/40 truncate">{p.description}</p>
                <p className="text-xs text-white/30 mt-1">{p.views || 0} views</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => toggleFeatured(p)}
                  title={p.featured ? "Unmark featured" : "Mark featured"}
                  className="text-white/40 hover:text-amber-400 transition-colors"
                >
                  <FiStar size={16} />
                </button>
                <button onClick={() => openEdit(p)} className="text-white/40 hover:text-white transition-colors">
                  <FiEdit2 size={16} />
                </button>
                <button onClick={() => remove(p._id)} className="text-white/40 hover:text-red-400 transition-colors">
                  <FiTrash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0c0d10] p-6 my-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white">
                {editing === "new" ? "Add Project" : "Edit Project"}
              </h3>
              <button type="button" onClick={() => setEditing(null)} className="text-white/40 hover:text-white">
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Title">
                <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
              </Field>
              <Field label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={2}
                  className={inputClass}
                />
              </Field>
              <Field label="Image URL">
                <input
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  required
                  placeholder="/projects/your-image.png or https://..."
                  className={inputClass}
                />
              </Field>
              <Field label="Technologies (comma separated)">
                <input
                  name="tags"
                  value={form.tags}
                  onChange={handleChange}
                  placeholder="React.js, Tailwind CSS, Node.js"
                  className={inputClass}
                />
              </Field>
              <Field label="Key features (one per line)">
                <textarea
                  name="features"
                  value={form.features}
                  onChange={handleChange}
                  rows={3}
                  className={inputClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Live URL">
                  <input name="liveUrl" value={form.liveUrl} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="GitHub URL">
                  <input name="codeUrl" value={form.codeUrl} onChange={handleChange} className={inputClass} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3 items-end">
                <Field label="Order">
                  <input
                    type="number"
                    name="order"
                    value={form.order}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
                <label className="flex items-center gap-2 text-sm text-white/70 pb-2.5">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="accent-white"
                  />
                  Featured
                </label>
              </div>
            </div>

            {formError && <p className="text-sm text-red-400 mt-4">{formError}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-5 rounded-lg bg-white text-black font-semibold text-sm py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Project"}
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
