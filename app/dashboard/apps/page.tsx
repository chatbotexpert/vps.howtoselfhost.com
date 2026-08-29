import Link from "next/link";
import { APP_CATALOG } from "@/lib/apps";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export const metadata = { title: "Install Apps" };

export default async function AppsPage() {
  const user = await requireAuth();

  const myVps = await db.vpsInstance.findMany({
    where: { userId: user.id, status: "running" },
    select: { id: true, name: true, ipAddress: true },
  });

  const categories = [...new Set(APP_CATALOG.map((a) => a.category))];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">One-Click App Installs</h2>
        <p className="text-slate-500 dark:text-gray-400">
          Install open-source apps directly onto your running VPS — no manual setup, no flushing your server. Our scripts detect your available resources and deploy everything with Docker.
        </p>
      </div>

      {myVps.length === 0 && (
        <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
          ⚠️ You need a <strong>running VPS</strong> to install apps. <Link href="/order" className="underline font-semibold">Deploy one now →</Link>
        </div>
      )}

      {categories.map((cat) => (
        <div key={cat} className="mb-10">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">{cat}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {APP_CATALOG.filter((a) => a.category === cat).map((app) => (
              <Link
                key={app.slug}
                href={`/dashboard/apps/${app.slug}`}
                className="group bg-white dark:bg-gray-900 rounded-2xl border border-slate-200/60 dark:border-gray-800 p-6 hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl leading-none">{app.icon}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 dark:text-white text-lg group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{app.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1 line-clamp-2">{app.description}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {app.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 text-xs rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between text-xs text-slate-400 dark:text-gray-500">
                  <span>Min {app.minRamMb >= 1024 ? `${app.minRamMb / 1024} GB` : `${app.minRamMb} MB`} RAM</span>
                  <span className="text-cyan-600 dark:text-cyan-500 font-semibold group-hover:underline">Install →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
