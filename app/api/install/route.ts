import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";
import { getApp } from "@/lib/apps";

export async function POST(req: Request) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { vpsId, appSlug, config } = await req.json();

  if (!vpsId || !appSlug) {
    return NextResponse.json({ error: "vpsId and appSlug are required" }, { status: 400 });
  }

  const app = getApp(appSlug);
  if (!app) return NextResponse.json({ error: "Unknown app" }, { status: 400 });

  const vps = await db.vpsInstance.findFirst({ where: { id: vpsId, userId: user.id } });
  if (!vps) return NextResponse.json({ error: "VPS not found" }, { status: 404 });

  if (!vps.ipAddress || !vps.sshUser || !vps.sshPassword) {
    return NextResponse.json({ error: "VPS SSH credentials are not configured. Contact support to activate your server." }, { status: 400 });
  }

  const installedApp = await db.installedApp.create({
    data: {
      vpsInstanceId: vpsId,
      appSlug,
      appName: app.name,
      status: "installing",
      config: JSON.stringify(config || {}),
    },
  });

  const job = await db.installJob.create({
    data: {
      installedAppId: installedApp.id,
      status: "queued",
    },
  });

  return NextResponse.json({ jobId: job.id, installedAppId: installedApp.id });
}
