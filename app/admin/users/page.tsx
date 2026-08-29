"use client";

import { useEffect, useState } from "react";
import { Shield, ShieldOff } from "lucide-react";

interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isAdmin: boolean;
  createdAt: string;
  _count: { vpsInstances: number; orders: number };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [toggling, setToggling] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/users");
    setUsers(await res.json());
  };

  useEffect(() => { load(); }, []);

  const toggleAdmin = async (user: User) => {
    setToggling(user.id);
    await fetch("/api/admin/users", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, isAdmin: !user.isAdmin }),
    });
    await load();
    setToggling(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Users</h1>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200/60 dark:border-gray-800 overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-gray-800/50">
            <tr>
              {["Name / Email", "VPS", "Orders", "Role", "Joined", ""].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900 dark:text-white">{u.firstName} {u.lastName}</div>
                  <div className="text-xs text-slate-400 dark:text-gray-500">{u.email}</div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-gray-300">{u._count.vpsInstances}</td>
                <td className="px-4 py-3 text-slate-600 dark:text-gray-300">{u._count.orders}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.isAdmin ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400" : "bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400"}`}>
                    {u.isAdmin ? "Admin" : "Customer"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 dark:text-gray-500 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleAdmin(u)}
                    disabled={toggling === u.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors disabled:opacity-50 border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800"
                  >
                    {u.isAdmin ? <ShieldOff className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                    {u.isAdmin ? "Remove Admin" : "Make Admin"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-slate-400 dark:text-gray-500">No users yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
