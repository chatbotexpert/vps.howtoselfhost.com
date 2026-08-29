import { db } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { getApp } from "@/lib/apps";
import { NodeSSH } from "node-ssh";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sse(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function GET(req: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { jobId } = await params;

  const job = await db.installJob.findUnique({
    where: { id: jobId },
    include: {
      installedApp: {
        include: { vpsInstance: true },
      },
    },
  });

  if (!job) return new Response("Job not found", { status: 404 });
  if (job.installedApp.vpsInstance.userId !== user.id) return new Response("Unauthorized", { status: 401 });

  const { installedApp } = job;
  const vps = installedApp.vpsInstance;
  const app = getApp(installedApp.appSlug);

  if (!app) return new Response("Unknown app", { status: 400 });

  const config: Record<string, string> = JSON.parse(installedApp.config || "{}");

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        try {
          controller.enqueue(encoder.encode(sse(data)));
        } catch {}
      };

      const appendLog = async (line: string) => {
        await db.installJob.update({
          where: { id: jobId },
          data: { logs: { set: job.logs + line + "\n" } },
        });
      };

      const log = (msg: string) => {
        send({ type: "log", message: msg });
        job.logs += msg + "\n";
      };

      try {
        if (job.status === "completed") {
          send({ type: "log", message: "✅ Already completed." });
          send({ type: "done", accessUrl: installedApp.accessUrl });
          controller.close();
          return;
        }

        if (job.status === "running") {
          send({ type: "log", message: "⚠️ This job is already running." });
          controller.close();
          return;
        }

        await db.installJob.update({ where: { id: jobId }, data: { status: "running", startedAt: new Date() } });

        log(`🚀 Connecting to ${vps.ipAddress}...`);

        const ssh = new NodeSSH();
        await ssh.connect({
          host: vps.ipAddress!,
          username: vps.sshUser || "root",
          password: vps.sshPassword!,
          timeout: 20000,
          readyTimeout: 20000,
        });

        log(`✅ Connected. Checking available resources...`);

        const ramResult = await ssh.execCommand("free -m | awk 'NR==2{print $7}'");
        const diskResult = await ssh.execCommand("df -m / | awk 'NR==2{print $4}'");
        const freeRamMb = parseInt(ramResult.stdout.trim()) || 0;
        const freeDiskMb = parseInt(diskResult.stdout.trim()) || 0;

        log(`📊 Available RAM: ${freeRamMb} MB | Available Disk: ${freeDiskMb} MB`);

        if (freeRamMb < app.minRamMb) {
          throw new Error(`Insufficient RAM. Need ${app.minRamMb} MB, have ${freeRamMb} MB free.`);
        }
        if (freeDiskMb < app.minDiskMb) {
          throw new Error(`Insufficient disk space. Need ${app.minDiskMb} MB, have ${freeDiskMb} MB free.`);
        }

        log(`✅ Resources check passed. Starting installation of ${app.name}...`);
        log(`─────────────────────────────────────────`);

        const script = app.buildScript(config);
        let accessUrl = "";

        await ssh.execCommand(`bash -c ${JSON.stringify(script)}`, {
          onStdout: (chunk) => {
            const lines = chunk.toString().split("\n");
            for (const line of lines) {
              if (!line.trim()) continue;
              if (line.includes("ACCESS_URL=")) {
                accessUrl = line.split("ACCESS_URL=")[1].trim();
              }
              log(line);
            }
          },
          onStderr: (chunk) => {
            const lines = chunk.toString().split("\n");
            for (const line of lines) {
              if (line.trim()) log(`  ${line}`);
            }
          },
        });

        ssh.dispose();

        log(`─────────────────────────────────────────`);
        log(`✅ ${app.name} installed successfully!`);
        if (accessUrl) log(`🌐 Access URL: ${accessUrl}`);

        await db.installJob.update({
          where: { id: jobId },
          data: { status: "completed", completedAt: new Date(), logs: job.logs },
        });
        await db.installedApp.update({
          where: { id: installedApp.id },
          data: { status: "running", accessUrl: accessUrl || null },
        });

        send({ type: "done", accessUrl });
      } catch (err: any) {
        const msg = err?.message || "Unknown error";
        log(`❌ Error: ${msg}`);
        await db.installJob.update({
          where: { id: jobId },
          data: { status: "failed", errorMessage: msg, logs: job.logs },
        });
        await db.installedApp.update({ where: { id: installedApp.id }, data: { status: "failed" } });
        send({ type: "error", message: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
