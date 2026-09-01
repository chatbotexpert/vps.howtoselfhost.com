"use client";

import { useState } from "react";
import { Server, Play, Power, Key } from "lucide-react";
import { useRouter } from "next/navigation";

type VpsInstance = {
  id: string;
  name: string | null;
  status: string;
  ipAddress: string | null;
  os: string;
  vcpu: string;
  memory: string;
  region: string;
  nextPayment: Date;
};

export default function VpsList({ initialInstances }: { initialInstances: VpsInstance[] }) {
  const router = useRouter();
  const [instances, setInstances] = useState<VpsInstance[]>(initialInstances);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Password Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedVpsForPassword, setSelectedVpsForPassword] = useState<VpsInstance | null>(null);
  const [newPassword, setNewPassword] = useState("");

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVpsForDelete, setSelectedVpsForDelete] = useState<VpsInstance | null>(null);

  const openPasswordModal = (vps: VpsInstance) => {
    setSelectedVpsForPassword(vps);
    setNewPassword("");
    setShowPasswordModal(true);
  };

  const openDeleteModal = (vps: VpsInstance) => {
    setSelectedVpsForDelete(vps);
    setShowDeleteModal(true);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVpsForPassword) return;
    
    setLoadingAction(`pwd-${selectedVpsForPassword.id}`);
    setError(null);

    try {
      const res = await fetch(`/api/vps/${selectedVpsForPassword.id}/password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");

      setShowPasswordModal(false);
      alert("Password updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedVpsForDelete) return;

    setLoadingAction(`del-${selectedVpsForDelete.id}`);
    setError(null);

    try {
      const res = await fetch(`/api/vps/${selectedVpsForDelete.id}/delete`, {
        method: "POST",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete VPS");

      setInstances((prev) => prev.filter((v) => v.id !== selectedVpsForDelete.id));
      setShowDeleteModal(false);
      alert("Server deleted successfully.");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  if (instances.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
          <Server className="h-8 w-8 text-slate-400 dark:text-gray-500" />
        </div>
        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No servers found</h4>
        <p className="text-slate-500 dark:text-gray-400 max-w-sm mb-6">You don't have any VPS instances active yet. Click below to deploy your first server.</p>
        <button onClick={() => router.push("/order")} className="bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-500 font-semibold px-4 py-2 rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-500/20 transition-colors">
          Deploy your first VPS
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-slate-200/60 dark:divide-gray-800">
        {instances.map((vps) => (
          <div key={vps.id} className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-slate-50 dark:hover:bg-gray-800/50 transition-colors">
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                vps.status === "running" ? "bg-cyan-500/10 border-cyan-500/20" : 
                vps.status === "pending_payment" ? "bg-orange-500/10 border-orange-500/20" : 
                "bg-slate-500/10 border-slate-500/20"
              }`}>
                <span className="relative flex h-3 w-3">
                  {vps.status === "running" && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${
                    vps.status === "running" ? "bg-cyan-500" : 
                    vps.status === "pending_payment" ? "bg-orange-500" : "bg-slate-400"
                  }`}></span>
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-lg">{vps.name}</h4>
                <div className="text-sm text-slate-500 dark:text-gray-400 flex items-center gap-2">
                   {vps.status === "pending_payment" ? "Awaiting Payment" : (vps.ipAddress || 'Provisioning')} • {vps.os}
                </div>
              </div>
            </div>

            <div className="hidden md:flex gap-4 sm:gap-8 items-center text-sm">
              <div>
                <div className="text-slate-500 dark:text-gray-400">Spec</div>
                <div className="font-semibold text-slate-900 dark:text-white">{vps.vcpu} vCPU / {vps.memory}</div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-gray-400">Location</div>
                <div className="font-semibold text-slate-900 dark:text-white">{vps.region}</div>
              </div>
              <div>
                <div className="text-slate-500 dark:text-gray-400">Next Payment</div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  {new Date(vps.nextPayment).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                </div>
              </div>
            </div>

            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
              <button 
                onClick={() => openPasswordModal(vps)}
                disabled={loadingAction === `pwd-${vps.id}`}
                className="flex-1 md:flex-none p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 transition-colors flex justify-center border border-slate-200 dark:border-gray-700"
                title="Change Password"
              >
                <Key className="h-5 w-5" />
              </button>
              <button 
                onClick={() => openDeleteModal(vps)}
                disabled={loadingAction === `del-${vps.id}`}
                className="flex-1 md:flex-none p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors flex justify-center border border-red-200 dark:border-red-900/50"
                title="Delete Server"
              >
                <Power className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-gray-800">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Change Root Password</h3>
            <p className="text-sm text-slate-500 dark:text-gray-400 mb-6">
              Enter a new secure root password for <strong>{selectedVpsForPassword?.name}</strong>.
            </p>
            {error && <div className="text-red-500 text-sm mb-4 bg-red-100 dark:bg-red-900/30 p-2 rounded">{error}</div>}
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password (min 8 chars)"
                className="w-full p-3 border border-slate-200 dark:border-gray-700 rounded-lg mb-6 bg-transparent text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none"
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingAction !== null}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition-colors font-medium disabled:opacity-50"
                >
                  {loadingAction ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-xl border border-slate-200 dark:border-gray-800">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-500 mb-4 flex items-center gap-2">
              <Power className="h-6 w-6" /> Terminate Server
            </h3>
            <p className="text-sm text-slate-600 dark:text-gray-300 mb-6">
              Are you absolutely sure you want to delete <strong>{selectedVpsForDelete?.name}</strong>? This action cannot be undone and all data will be permanently lost.
            </p>
            {error && <div className="text-red-500 text-sm mb-4 bg-red-100 dark:bg-red-900/30 p-2 rounded">{error}</div>}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteSubmit}
                disabled={loadingAction !== null}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors font-medium disabled:opacity-50"
              >
                {loadingAction ? "Deleting..." : "Yes, Delete Server"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
