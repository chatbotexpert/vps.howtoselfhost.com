"use client";

import { useState } from "react";
import { Box, Activity, Server, ArrowRight, Terminal } from "lucide-react";
import Link from "next/link";

const apps = [
  {
    id: "wordpress",
    name: "WordPress",
    description: "Deploy high-performance CMS installations optimized for speed.",
    icon: Box,
  },
  {
    id: "n8n",
    name: "n8n Automation",
    description: "Automate your workflows powerfully with self-hosted n8n.",
    icon: Activity,
  },
  {
    id: "nextcloud",
    name: "Nextcloud",
    description: "Sync and share your files securely in a private environment.",
    icon: Server,
  },
  {
    id: "docker",
    name: "Docker & Portainer",
    description: "Run containerized applications instantly with pre-configured Docker environments.",
    icon: Terminal,
  },
];

export function AppHoverReveal() {
  const [hoveredApp, setHoveredApp] = useState(apps[0]);

  return (
    <div className="flex flex-col md:flex-row gap-0 border-y border-divider relative overflow-hidden bg-background">
      {/* Huge background watermark text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10vw] font-mono font-bold text-watermark pointer-events-none select-none whitespace-nowrap z-0 tracking-tighter">
        SCRIPTS
      </div>
      
      {/* Left side: List */}
      <div className="w-full md:w-1/2 border-r border-divider flex flex-col z-10">
        {apps.map((app) => (
          <div
            key={app.id}
            className={`py-10 px-8 md:px-16 cursor-pointer border-b border-divider last:border-b-0 transition-all duration-300 ${
              hoveredApp.id === app.id ? "bg-surface" : "hover:bg-surface"
            }`}
            onMouseEnter={() => setHoveredApp(app)}
          >
            <h3 className={`text-3xl md:text-5xl font-bold font-sans tracking-tight transition-colors ${hoveredApp.id === app.id ? "text-foreground" : "text-muted opacity-50"}`}>
              {app.name}
            </h3>
          </div>
        ))}
        <div className="py-10 px-8 md:px-16 bg-surface">
           <Link href="/pricing" className="text-muted hover:text-foreground font-mono flex items-center gap-2 group transition-colors font-bold uppercase tracking-wider">
              VIEW PLANS TO DEPLOY <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>
      </div>

      {/* Right side: Dynamic Viewfinder */}
      <div className="w-full md:w-1/2 p-12 md:p-24 flex items-center justify-center relative z-10 min-h-[400px] bg-transparent">
        <div className="flex flex-col items-start w-full max-w-sm relative">
          <div className="w-24 h-24 border border-divider bg-surface flex items-center justify-center mb-10 animate-fade-in" key={hoveredApp.id + "-icon"}>
            <hoveredApp.icon className="w-10 h-10 text-foreground" />
          </div>
          
          <h4 className="text-3xl font-bold text-foreground mb-4 animate-slide-up tracking-tight" key={hoveredApp.id + "-title"}>
            {hoveredApp.name}
          </h4>
          
          <div className="h-[1px] w-12 bg-accent mb-6 animate-slide-up" style={{ animationDelay: '50ms' }}></div>

          <p className="text-muted font-mono text-sm leading-relaxed animate-slide-up" key={hoveredApp.id + "-desc"} style={{ animationDelay: '100ms' }}>
            {hoveredApp.description}
          </p>
        </div>
      </div>
    </div>
  );
}
