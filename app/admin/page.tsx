import { db } from "@/lib/db";
import { Users, Server, ShoppingCart, DollarSign } from "lucide-react";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminPage() {
  const [userCount, vpsCount, orderCount, orders] = await Promise.all([
    db.user.count(),
    db.vpsInstance.count(),
    db.order.count(),
    db.order.findMany({ select: { amount: true, status: true } }),
  ]);

  const totalRevenue = orders.filter((o) => o.status === "paid").reduce((sum, o) => sum + o.amount, 0);
  const pendingOrders = orders.filter((o) => o.status === "unpaid").length;

  const stats = [
    { label: "Total Users", value: userCount, icon: Users, color: "blue" },
    { label: "VPS Instances", value: vpsCount, icon: Server, color: "green" },
    { label: "Total Orders", value: orderCount, icon: ShoppingCart, color: "purple" },
    { label: "Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: "yellow" },
  ];

  const recentOrders = await db.order.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true } }, vpsInstance: { select: { name: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200/60 dark:border-gray-800 p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3 text-slate-500 dark:text-gray-400">
              <Icon className="h-5 w-5 text-cyan-500" />
              <span className="text-sm font-medium">{label}</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</div>
          </div>
        ))}
      </div>

      {pendingOrders > 0 && (
        <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-xl text-orange-700 dark:text-orange-400 text-sm font-medium">
          ⚠️ {pendingOrders} unpaid order{pendingOrders !== 1 ? "s" : ""} waiting for approval →{" "}
          <a href="/admin/orders" className="underline">Review Orders</a>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-slate-200/60 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-200/60 dark:border-gray-800 font-bold text-slate-900 dark:text-white">
          Recent Orders
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-gray-800/50">
            <tr>
              {["Customer", "Server", "Amount", "Status", "Date"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-gray-800">
            {recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-gray-800/30 transition-colors">
                <td className="px-4 py-3 text-slate-700 dark:text-gray-300">{order.user.email}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-gray-400">{order.vpsInstance?.name || "—"}</td>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">${order.amount.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    order.status === "paid" ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400"
                    : order.status === "unpaid" ? "bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400"
                    : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 dark:text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
