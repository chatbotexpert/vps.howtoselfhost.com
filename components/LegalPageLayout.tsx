import { ReactNode } from "react";

export function LegalPageLayout({ 
  title, 
  lastUpdated, 
  children 
}: { 
  title: string; 
  lastUpdated: string; 
  children: ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 min-h-[60vh]">
      <div className="mb-12 border-b border-slate-200 dark:border-gray-800 pb-8">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
          {title}
        </h1>
        <p className="text-slate-500 dark:text-gray-400">
          Last Updated: {lastUpdated}
        </p>
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-cyan-600 dark:prose-a:text-cyan-400">
        {children}
      </div>
    </div>
  );
}
