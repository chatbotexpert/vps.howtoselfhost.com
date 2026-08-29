import { Server, Activity, ArrowUpRight, Play, Power } from "lucide-react";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

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
        {vpsInstances.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
            <div className="w-16 h-16 bg-slate-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Server className="h-8 w-8 text-slate-400 dark:text-gray-500" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No servers found</h4>
            <p className="text-slate-500 dark:text-gray-400 max-w-sm mb-6">You don&apos;t have any VPS instances active yet. Click below to deploy your first server.</p>
            <Link href="/order" className="bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-500 font-semibold px-4 py-2 rounded-lg hover:bg-cyan-200 dark:hover:bg-cyan-500/20 transition-colors">
              Deploy your first VPS
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/60 dark:divide-gray-800">
            {vpsInstances.map((vps) => (
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
                      {vps.nextPayment.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <button className="flex-1 md:flex-none p-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-slate-700 dark:text-slate-300 transition-colors flex justify-center border border-slate-200 dark:border-gray-700">
                    <Play className="h-5 w-5" />
                  </button>
                  <button className="flex-1 md:flex-none p-2 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-colors flex justify-center border border-red-200 dark:border-red-900/50">
                    <Power className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
