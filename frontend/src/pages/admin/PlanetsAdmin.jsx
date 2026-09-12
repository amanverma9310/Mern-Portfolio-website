import { useEffect, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX } from "react-icons/fi";
import { api } from "../../services/api";

const emptyForm = {
  label: "",
  detail: "",
  color: "#3d7bff",
  size: 12,
  orbitRadius: 150,
  orbitDuration: 20,
  startAngle: 0,
  order: 0,
};

export default function PlanetsAdmin() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/planets")
      .then((res) => setPlanets(res.data))
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
      label: p.label,
      detail: p.detail,
      color: p.color,
      size: p.size,
      orbitRadius: p.orbitRadius,
      orbitDuration: p.orbitDuration,
      startAngle: p.startAngle,
      order: p.order,
    });
    setFormError("");
    setEditing(p);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);

    const payload = {
      label: form.label.trim(),
      detail: form.detail.trim(),
      color: form.color,
      size: Number(form.size),
      orbitRadius: Number(form.orbitRadius),
      orbitDuration: Number(form.orbitDuration),
      startAngle: Number(form.startAngle),
      order: Number(form.order) || 0,
    };

    try {
      if (editing === "new") {
        const res = await api.post("/planets", payload);
        setPlanets((prev) => [...prev, res.data].sort((a, b) => a.order - b.order));
      } else {
        const res = await api.put(`/planets/${editing._id}`, payload);
        setPlanets((prev) => prev.map((p) => (p._id === editing._id ? res.data : p)));
      }
      setEditing(null);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this journey item?")) return;
    await api.delete(`/planets/${id}`);
    setPlanets((prev) => prev.filter((p) => p._id !== id));
  };

  const move = async (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= planets.length) return;
    const reordered = [...planets];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setPlanets(reordered);
    const order = reordered.map((p, i) => ({ id: p._id, order: i }));
    await api.patch("/planets/reorder", { order });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">Journey</h1>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-lg bg-white text-black text-xs font-semibold px-3 py-2 hover:bg-white/90 transition-colors"
        >
          <FiPlus size={14} /> Add Item
        </button>
      </div>
      <p className="text-white/40 text-sm mb-6">
        Powers the orbiting-planets timeline on your portfolio. Use the arrows to reorder.
      </p>

      {error && (
        <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-white/30">Loading…</p>
        ) : planets.length === 0 ? (
          <p className="text-sm text-white/30">No journey items yet.</p>
        ) : (
          planets.map((p, i) => (
            <div
              key={p._id}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <span
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: p.color, boxShadow: `0 0 10px 2px ${p.color}55` }}
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-white truncate">{p.label}</h3>
                <p className="text-xs text-white/40 truncate">{p.detail}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="text-white/40 hover:text-white disabled:opacity-20 transition-colors text-xs"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === planets.length - 1}
                  className="text-white/40 hover:text-white disabled:opacity-20 transition-colors text-xs"
                >
                  ↓
                </button>
                <button onClick={() => openEdit(p)} className="text-white/40 hover:text-white transition-colors">
                  <FiEdit2 size={14} />
                </button>
                <button onClick={() => remove(p._id)} className="text-white/40 hover:text-red-400 transition-colors">
                  <FiTrash2 size={14} />
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
            className="w-full max-w-md rounded-xl border border-white/10 bg-[#0c0d10] p-6 my-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-white">{editing === "new" ? "Add Journey Item" : "Edit Journey Item"}</h3>
              <button type="button" onClick={() => setEditing(null)} className="text-white/40 hover:text-white">
                <FiX size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Label">
                <input name="label" value={form.label} onChange={handleChange} required className={inputClass} />
              </Field>
              <Field label="Detail">
                <textarea name="detail" value={form.detail} onChange={handleChange} required rows={2} className={inputClass} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Color (hex)">
                  <input name="color" value={form.color} onChange={handleChange} className={inputClass} />
                </Field>
                <Field label="Planet size (4-40)">
                  <input type="number" name="size" value={form.size} onChange={handleChange} className={inputClass} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Orbit radius (40-400)">
                  <input
                    type="number"
                    name="orbitRadius"
                    value={form.orbitRadius}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
                <Field label="Orbit duration (secs)">
                  <input
                    type="number"
                    name="orbitDuration"
                    value={form.orbitDuration}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="Start angle (0-360)">
                <input
                  type="number"
                  name="startAngle"
                  value={form.startAngle}
                  onChange={handleChange}
                  className={inputClass}
                />
              </Field>
            </div>

            {formError && <p className="text-sm text-red-400 mt-4">{formError}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full mt-5 rounded-lg bg-white text-black font-semibold text-sm py-2.5 hover:bg-white/90 transition-colors disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save Item"}
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
