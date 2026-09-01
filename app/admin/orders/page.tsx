"use client";

import { useEffect, useState } from "react";

interface Order {
  id: string;
  amount: number;
  status: string;
  paymentMethod: string;
  termMonths: number;
  planId: string;
  createdAt: string;
  user: { email: string; firstName: string | null; lastName: string | null };
  vpsInstance: { name: string | null; region: string } | null;
  stripePaymentIntentId: string | null;
}

const STATUS_OPTIONS = ["unpaid", "paid", "cancelled"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/orders");
    setOrders(await res.json());
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    await fetch(`/api/admin/orders/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    await load();
    setUpdating(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Orders</h1>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200/60 dark:border-gray-800 overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-gray-800/50">
            <tr>
              {["Customer", "Server", "Plan", "Amount", "Method", "Payment ID", "Status", "Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900 dark:text-white">{o.user.firstName} {o.user.lastName}</div>
                  <div className="text-xs text-slate-400 dark:text-gray-500">{o.user.email}</div>
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-gray-300">{o.vpsInstance?.name || "—"}<br /><span className="text-xs text-slate-400">{o.vpsInstance?.region || ""}</span></td>
                <td className="px-4 py-3 text-slate-500 dark:text-gray-400 text-xs">{o.planId}<br />{o.termMonths}mo</td>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">${o.amount.toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-gray-400 capitalize">{o.paymentMethod}</td>
                <td className="px-4 py-3 text-slate-400 dark:text-gray-500 text-xs font-mono">
                  {o.stripePaymentIntentId ? o.stripePaymentIntentId : "—"}
                </td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    disabled={updating === o.id}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none cursor-pointer disabled:opacity-50 ${
                      o.status === "paid" ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30"
                      : o.status === "unpaid" ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/30"
                      : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30"
                    }`}
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-400 dark:text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400 dark:text-gray-500">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
