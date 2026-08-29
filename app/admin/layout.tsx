import Link from "next/link";
import { LayoutDashboard, Package, ShoppingCart, Users, Server, Terminal } from "lucide-react";
import { requireAdmin } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/plans", label: "VPS Plans", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/vps", label: "VPS Instances", icon: Server },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-950">
      <aside className="w-60 bg-white dark:bg-gray-900 border-r border-slate-200/60 dark:border-gray-800 flex flex-col fixed inset-y-0 z-10">
        <div className="h-16 flex items-center px-5 border-b border-slate-200/60 dark:border-gray-800 gap-2">
          <div className="p-1.5 bg-cyan-500/10 rounded-lg">
            <Terminal className="h-4 w-4 text-cyan-500" />
          </div>
          <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
            Admin<span className="text-cyan-500"> Panel</span>
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors text-sm font-medium"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-slate-200/60 dark:border-gray-800 flex flex-col gap-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 dark:text-gray-500 hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors text-sm font-medium">
            ← Customer Dashboard
          </Link>
        </div>
      </aside>

      <main className="flex-1 ml-60 flex flex-col min-h-screen">
        <header className="h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-gray-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-gray-800 sticky top-0 z-10">
          <span className="text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-3 py-1 rounded-full border border-red-200 dark:border-red-500/20">
            Admin Mode
          </span>
          <ThemeToggle />
        </header>
        <div className="p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
