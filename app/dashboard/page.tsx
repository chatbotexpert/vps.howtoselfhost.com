import { Server, Activity, ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import VpsList from "./VpsList";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  const vpsInstances = await db.vpsInstance.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const activeCount = vpsInstances.filter(vps => vps.status === "running").length;
  const user = await db.user.findUnique({ where: { id: userId } });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.firstName || "Customer"}!</h2>
          <p className="text-slate-500 dark:text-gray-400 mt-1">Here&apos;s what&apos;s happening with your servers.</p>
        </div>
        <Link href="/order" className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-md shadow-cyan-500/20 flex items-center gap-2">
          <Server className="h-4 w-4" /> Deploy New VPS
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-gray-400 font-medium">
            <Server className="h-5 w-5 text-cyan-500" /> Total Active VPS
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">{activeCount}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-gray-400 font-medium">
            <Activity className="h-5 w-5 text-blue-500" /> Avg. Uptime
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">99.9%</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-slate-500 dark:text-gray-400 font-medium">
            <ArrowUpRight className="h-5 w-5 text-purple-500" /> Total Traffic (This mo.)
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">1.2 TB</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-2 text-slate-500 dark:text-gray-400 font-medium">
            <div className="flex items-center gap-2">Current Bill</div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 dark:text-white">$8.99</div>
        </div>
      </div>

      {/* Active Servers List */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200/60 dark:border-gray-800 overflow-hidden shadow-sm flex flex-col min-h-[300px]">
        <div className="px-6 py-4 border-b border-slate-200/60 dark:border-gray-800 flex justify-between items-center bg-slate-50/50 dark:bg-gray-900/50">
          <h3 className="font-bold text-slate-900 dark:text-white">Your Servers</h3>
        </div>
        
        <VpsList initialInstances={vpsInstances} />

      </div>
    </div>
  );
}
