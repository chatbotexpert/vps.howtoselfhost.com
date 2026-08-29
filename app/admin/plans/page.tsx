"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Star } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  period: string;
  cpu: string;
  ram: string;
  storage: string;
  bandwidth: string;
  popular: boolean;
  active: boolean;
  sortOrder: number;
}

const empty: Omit<Plan, "id"> = {
  name: "", slug: "", description: "", price: 0, period: "mo",
  cpu: "", ram: "", storage: "", bandwidth: "", popular: false, active: true, sortOrder: 0,
};

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [editing, setEditing] = useState<Partial<Plan> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    const res = await fetch("/api/admin/plans");
    setPlans(await res.json());
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setIsNew(true); setEditing({ ...empty }); setError(""); };
  const openEdit = (p: Plan) => { setIsNew(false); setEditing({ ...p }); setError(""); };
  const closeModal = () => { setEditing(null); setError(""); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const url = isNew ? "/api/admin/plans" : `/api/admin/plans/${editing.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error); }
      await load();
      closeModal();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  };

  const deletePlan = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    await fetch(`/api/admin/plans/${id}`, { method: "DELETE" });
    await load();
  };

  const field = (key: keyof typeof empty, label: string, type = "text") => (
    <div key={key}>
      <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={String((editing as any)?.[key] ?? "")}
        onChange={(e) => setEditing((p) => ({ ...p, [key]: type === "number" ? parseFloat(e.target.value) : e.target.value }))}
        className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
      />
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">VPS Plans</h1>
        <button onClick={openNew} className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
          <Plus className="h-4 w-4" /> Add Plan
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200/60 dark:border-gray-800 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-gray-800/50">
            <tr>
              {["Name", "Price", "CPU", "RAM", "Storage", "Popular", "Active", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {plans.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-900 dark:text-white">{p.name}</div>
                  <div className="text-xs text-slate-400 dark:text-gray-500">{p.slug}</div>
                </td>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">${p.price}/{p.period}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-gray-300">{p.cpu}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-gray-300">{p.ram}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-gray-300">{p.storage}</td>
                <td className="px-4 py-3">{p.popular && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.active ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400" : "bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400"}`}>
                    {p.active ? "Active" : "Hidden"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-400 transition-colors"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => deletePlan(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {plans.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400 dark:text-gray-500">No plans yet. Click "Add Plan" to create one.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200/60 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 dark:border-gray-800">
              <h2 className="font-bold text-slate-900 dark:text-white">{isNew ? "Create Plan" : "Edit Plan"}</h2>
              <button onClick={closeModal}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {field("name", "Plan Name")}
              {field("slug", "Slug (URL-safe)")}
              {field("price", "Price ($)", "number")}
              {field("period", "Period (e.g. mo)")}
              {field("cpu", "CPU (e.g. 4 vCores)")}
              {field("ram", "RAM (e.g. 8 GB)")}
              {field("storage", "Storage (e.g. 200 GB NVMe)")}
              {field("bandwidth", "Bandwidth (e.g. 32 TB)")}
              {field("sortOrder", "Sort Order", "number")}
              <div className="col-span-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-1">Description</label>
                <textarea
                  value={editing.description || ""}
                  onChange={(e) => setEditing((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 resize-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="popular" checked={!!editing.popular} onChange={(e) => setEditing((p) => ({ ...p, popular: e.target.checked }))} className="rounded" />
                <label htmlFor="popular" className="text-sm font-medium text-slate-700 dark:text-gray-300">Mark as Popular</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={!!editing.active} onChange={(e) => setEditing((p) => ({ ...p, active: e.target.checked }))} className="rounded" />
                <label htmlFor="active" className="text-sm font-medium text-slate-700 dark:text-gray-300">Active (visible)</label>
              </div>
            </div>
            {error && <p className="px-6 pb-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div className="px-6 py-4 border-t border-slate-200/60 dark:border-gray-800 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg transition-colors">Cancel</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors disabled:opacity-50">
                <Check className="h-4 w-4" />{saving ? "Saving..." : "Save Plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
