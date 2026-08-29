"use client";

import { useEffect, useState } from "react";
import { Pencil, X, Check, Key } from "lucide-react";

interface VpsInstance {
  id: string;
  name: string | null;
  ipAddress: string | null;
  sshUser: string | null;
  sshPassword: string | null;
  os: string;
  memory: string;
  vcpu: string;
  region: string;
  status: string;
  createdAt: string;
  user: { email: string; firstName: string | null; lastName: string | null };
}

const STATUS_OPTIONS = ["pending_payment", "provisioning", "running", "stopped", "suspended"];

export default function VpsAdminPage() {
  const [instances, setInstances] = useState<VpsInstance[]>([]);
  const [editing, setEditing] = useState<Partial<VpsInstance> | null>(null);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const res = await fetch("/api/admin/vps");
    setInstances(await res.json());
  };

  useEffect(() => { load(); }, []);

  const openEdit = (v: VpsInstance) => setEditing({ ...v });
  const closeModal = () => setEditing(null);

  const save = async () => {
    if (!editing?.id) return;
    setSaving(true);
    await fetch(`/api/admin/vps/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ipAddress: editing.ipAddress,
        sshUser: editing.sshUser,
        sshPassword: editing.sshPassword,
        status: editing.status,
        name: editing.name,
      }),
    });
    await load();
    closeModal();
    setSaving(false);
  };

  const statusColor = (s: string) =>
    s === "running" ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400"
    : s === "pending_payment" ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400"
    : s === "provisioning" ? "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
    : "bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400";

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">VPS Instances</h1>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200/60 dark:border-gray-800 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-gray-800/50">
            <tr>
              {["Server", "Customer", "Specs", "IP / SSH", "Status", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {instances.map((v) => (
              <tr key={v.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900 dark:text-white">{v.name || "Unnamed"}</div>
                  <div className="text-xs text-slate-400 dark:text-gray-500">{v.region} · {v.os}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-slate-700 dark:text-gray-300">{v.user.firstName} {v.user.lastName}</div>
                  <div className="text-xs text-slate-400 dark:text-gray-500">{v.user.email}</div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-gray-300 text-xs">{v.vcpu} vCPU · {v.memory}</td>
                <td className="px-4 py-3">
                  {v.ipAddress ? (
                    <div className="font-mono text-xs text-slate-700 dark:text-gray-300 flex items-center gap-1">
                      {v.sshUser && <Key className="h-3 w-3 text-cyan-500" />}
                      {v.ipAddress}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-gray-500 italic">Not set</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(v.status)}`}>{v.status}</span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => openEdit(v)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-500 transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {instances.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400 dark:text-gray-500">No VPS instances yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200/60 dark:border-gray-700">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200/60 dark:border-gray-800">
              <h2 className="font-bold text-slate-900 dark:text-white">Edit VPS — {editing.name}</h2>
              <button onClick={closeModal}><X className="h-5 w-5 text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: "name", label: "Server Name" },
                { key: "ipAddress", label: "IP Address" },
                { key: "sshUser", label: "SSH Username" },
                { key: "sshPassword", label: "SSH Password" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-1">{label}</label>
                  <input
                    type={key === "sshPassword" ? "password" : "text"}
                    value={String((editing as any)[key] ?? "")}
                    onChange={(e) => setEditing((p) => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-gray-700 rounded-lg bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-gray-400 mb-1">Status</label>
                <select
                  value={editing.status || ""}
                  onChange={(e) => setEditing((p) => ({ ...p, status: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <p className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg p-3">
                ⚠️ SSH credentials are stored to enable one-click app installs. Only fill them in for running servers.
              </p>
            </div>
            <div className="px-6 py-4 border-t border-slate-200/60 dark:border-gray-800 flex justify-end gap-3">
              <button onClick={closeModal} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 rounded-lg">Cancel</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg disabled:opacity-50">
                <Check className="h-4 w-4" />{saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
