"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Terminal, Play, CheckCircle, XCircle, Clock, ExternalLink, ChevronDown } from "lucide-react";
import type { App } from "@/lib/apps";

interface Vps {
  id: string;
  name: string | null;
  ipAddress: string | null;
  sshUser: string | null;
}

interface PreviousInstall {
  id: string;
  status: string;
  accessUrl: string | null;
  createdAt: Date;
  vpsInstance: { name: string | null };
  installJob: { status: string; logs: string } | null;
}

type Phase = "config" | "installing" | "done" | "error";

export default function AppInstaller({
  app,
  myVps,
  previousInstalls,
}: {
  app: App;
  myVps: Vps[];
  previousInstalls: PreviousInstall[];
}) {
  const [selectedVps, setSelectedVps] = useState(myVps[0]?.id || "");
  const [config, setConfig] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<Phase>("config");
  const [logs, setLogs] = useState<string[]>([]);
  const [accessUrl, setAccessUrl] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [jobId, setJobId] = useState("");
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const setField = (key: string, value: string) =>
    setConfig((prev) => ({ ...prev, [key]: value }));

  const startInstall = async () => {
    if (!selectedVps) return;

    setPhase("installing");
    setLogs([`🚀 Starting installation of ${app.name}...`]);
    setErrMsg("");

    // 1. Create the job
    const res = await fetch("/api/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vpsId: selectedVps, appSlug: app.slug, config }),
    });

    const data = await res.json();

    if (!res.ok) {
      setPhase("error");
      setErrMsg(data.error || "Failed to start install");
      return;
    }

    const newJobId = data.jobId;
    setJobId(newJobId);

    // 2. Connect to SSE stream
    const evtSource = new EventSource(`/api/install/${newJobId}/stream`);

    evtSource.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "log") {
        setLogs((prev) => [...prev, msg.message]);
      } else if (msg.type === "done") {
        setAccessUrl(msg.accessUrl || "");
        setPhase("done");
        evtSource.close();
      } else if (msg.type === "error") {
        setErrMsg(msg.message);
        setPhase("error");
        evtSource.close();
      }
    };

    evtSource.onerror = () => {
      setErrMsg("Connection to server lost. Check the job status below.");
      setPhase("error");
      evtSource.close();
    };
  };

  const reset = () => {
    setPhase("config");
    setLogs([]);
    setAccessUrl("");
    setErrMsg("");
    setJobId("");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard/apps" className="inline-flex items-center gap-2 text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to Apps
      </Link>

      {/* App Header */}
      <div className="flex items-center gap-5 mb-8">
        <div className="text-6xl">{app.icon}</div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{app.name}</h1>
          <p className="text-slate-500 dark:text-gray-400 mt-1">{app.description}</p>
          <div className="flex gap-2 mt-2">
            {app.tags.map((t) => (
              <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-gray-800 text-slate-500 dark:text-gray-400 text-xs rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Requirements */}
      <div className="bg-slate-50 dark:bg-gray-900/50 border border-slate-200 dark:border-gray-800 rounded-xl p-4 mb-6 flex flex-wrap gap-6 text-sm">
        <div><span className="text-slate-400 dark:text-gray-500">Min RAM</span><br /><strong className="text-slate-900 dark:text-white">{app.minRamMb >= 1024 ? `${app.minRamMb / 1024} GB` : `${app.minRamMb} MB`}</strong></div>
        <div><span className="text-slate-400 dark:text-gray-500">Min Disk</span><br /><strong className="text-slate-900 dark:text-white">{app.minDiskMb >= 1024 ? `${app.minDiskMb / 1024} GB` : `${app.minDiskMb} MB`}</strong></div>
        <div><span className="text-slate-400 dark:text-gray-500">Default Port</span><br /><strong className="text-slate-900 dark:text-white">{app.port}</strong></div>
        <div><span className="text-slate-400 dark:text-gray-500">Min CPU</span><br /><strong className="text-slate-900 dark:text-white">{app.minCpu} core{app.minCpu > 1 ? "s" : ""}</strong></div>
      </div>

      {/* Install Panel */}
      {phase === "config" && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-slate-200/60 dark:border-gray-800 shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-gray-800">
            <h2 className="font-bold text-slate-900 dark:text-white">Configure Installation</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">Our script will check your VPS resources before installing.</p>
          </div>
          <div className="p-6 space-y-5">
            {/* VPS selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">Select VPS Server</label>
              {myVps.length === 0 ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-xl text-amber-700 dark:text-amber-400 text-sm">
                  No running VPS found. <Link href="/order" className="underline font-semibold">Deploy one first →</Link>
                </div>
              ) : (
                <div className="relative">
                  <select
                    value={selectedVps}
                    onChange={(e) => setSelectedVps(e.target.value)}
                    className="w-full appearance-none px-4 py-3 border border-slate-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 pr-10"
                  >
                    {myVps.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name || "Unnamed"} — {v.ipAddress || "no IP"}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              )}
            </div>

            {/* App-specific fields */}
            {app.fields.map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  {field.label} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.helpText && <p className="text-xs text-slate-400 dark:text-gray-500 mb-2">{field.helpText}</p>}
                <input
                  type={field.type}
                  required={field.required}
                  placeholder={field.placeholder}
                  value={config[field.key] || ""}
                  onChange={(e) => setField(field.key, e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 dark:border-gray-700 rounded-xl bg-transparent dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder-slate-400 dark:placeholder-gray-600"
                />
              </div>
            ))}

            {app.fields.length === 0 && (
              <p className="text-sm text-slate-400 dark:text-gray-500 italic">No configuration needed — this app installs with defaults.</p>
            )}
          </div>
          <div className="px-6 py-4 border-t border-slate-100 dark:border-gray-800">
            <button
              onClick={startInstall}
              disabled={myVps.length === 0 || !selectedVps}
              className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-cyan-500/20"
            >
              <Play className="h-5 w-5" />
              Install {app.name}
            </button>
            <p className="text-xs text-center text-slate-400 dark:text-gray-500 mt-3">
              This will SSH into your VPS, check resources, and run the installation script.
            </p>
          </div>
        </div>
      )}

      {(phase === "installing" || phase === "done" || phase === "error") && (
        <div className="bg-gray-950 rounded-2xl border border-gray-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900">
            <div className="flex items-center gap-3">
              <Terminal className="h-4 w-4 text-cyan-500" />
              <span className="text-sm font-mono font-semibold text-white">
                {phase === "installing" ? `Installing ${app.name}...` : phase === "done" ? "Installation complete" : "Installation failed"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {phase === "installing" && (
                <span className="flex gap-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />
                </span>
              )}
              {phase === "done" && <CheckCircle className="h-5 w-5 text-cyan-500" />}
              {phase === "error" && <XCircle className="h-5 w-5 text-red-500" />}
            </div>
          </div>

          <div className="p-4 font-mono text-sm text-gray-300 min-h-[300px] max-h-[500px] overflow-y-auto space-y-0.5 bg-gray-950">
            {logs.map((line, i) => (
              <div key={i} className={`leading-relaxed ${line.startsWith("❌") ? "text-red-400" : line.startsWith("✅") || line.startsWith("🎉") ? "text-cyan-400" : line.startsWith(">>>") ? "text-cyan-300" : line.startsWith("📊") || line.startsWith("🌐") ? "text-blue-300" : "text-gray-300"}`}>
                {line}
              </div>
            ))}
            {phase === "installing" && (
              <div className="text-cyan-500 animate-pulse">▊</div>
            )}
            <div ref={logsEndRef} />
          </div>

          {phase === "done" && (
            <div className="p-4 border-t border-gray-800 bg-gray-900 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <CheckCircle className="h-5 w-5 text-cyan-500 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-cyan-400">{app.name} installed successfully!</p>
                  {accessUrl && <p className="text-xs text-cyan-500/70 mt-0.5">{accessUrl}</p>}
                </div>
                {accessUrl && (
                  <a href={accessUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-lg transition-colors">
                    Open <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <button onClick={reset} className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors">
                Install another app or re-run
              </button>
            </div>
          )}

          {phase === "error" && (
            <div className="p-4 border-t border-gray-800 bg-gray-900 space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
                ❌ {errMsg || "Installation failed. Check the logs above."}
              </div>
              <button onClick={reset} className="w-full py-2 text-sm text-gray-400 hover:text-white transition-colors">
                ← Try again
              </button>
            </div>
          )}
        </div>
      )}

      {/* Previous installs */}
      {previousInstalls.length > 0 && (
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-slate-500 dark:text-gray-400 uppercase tracking-wider mb-4">Previous Installations</h3>
          <div className="space-y-3">
            {previousInstalls.map((install) => (
              <div key={install.id} className="bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-gray-800 rounded-xl px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {install.status === "running" ? <CheckCircle className="h-5 w-5 text-cyan-500" />
                  : install.status === "failed" ? <XCircle className="h-5 w-5 text-red-500" />
                  : <Clock className="h-5 w-5 text-yellow-500" />}
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{install.vpsInstance.name || "Unnamed VPS"}</div>
                    <div className="text-xs text-slate-400 dark:text-gray-500">{new Date(install.createdAt).toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    install.status === "running" ? "bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400"
                    : install.status === "failed" ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400"
                    : "bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                  }`}>{install.status}</span>
                  {install.accessUrl && (
                    <a href={install.accessUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-500 hover:underline text-xs flex items-center gap-1">
                      Open <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
