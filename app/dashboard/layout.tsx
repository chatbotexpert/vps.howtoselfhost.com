import Link from "next/link";
import { Server, LayoutDashboard, CreditCard, Settings, Headset, LayoutGrid } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import LogoutButton from "./LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    // Cookie exists but user was deleted
    redirect("/login");
  }

  const initials = user.firstName 
     ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`.toUpperCase()
     : user.email.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-slate-200/60 dark:border-gray-800 flex flex-col hidden md:flex fixed inset-y-0 z-10">
        <div className="h-16 flex items-center px-6 border-b border-slate-200/60 dark:border-gray-800">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-1.5 bg-cyan-500/10 rounded-lg">
              <Server className="h-5 w-5 text-cyan-600 dark:text-cyan-500" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
              Panel
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-medium transition-colors">
            <LayoutDashboard className="h-5 w-5" />
            Overview
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors font-medium">
            <Server className="h-5 w-5" />
            My Servers
          </Link>
          <Link href="/dashboard/apps" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors font-medium">
            <LayoutGrid className="h-5 w-5" />
            Install Apps
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors font-medium">
            <CreditCard className="h-5 w-5" />
            Billing
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors font-medium mt-auto">
            <Headset className="h-5 w-5" />
            Support
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors font-medium">
            <Settings className="h-5 w-5" />
            Settings
          </Link>
          
          <LogoutButton />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-gray-800 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Customer Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">
              {user.email}
            </span>
            <ThemeToggle />
            <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/20">
              {initials}
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
