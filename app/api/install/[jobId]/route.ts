import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ jobId: string }> }) {
  const user = await getSessionFromRequest(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { jobId } = await params;
  const job = await db.installJob.findUnique({
    where: { id: jobId },
    include: { installedApp: { include: { vpsInstance: { select: { userId: true } } } } },
  });

  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
  if (job.installedApp.vpsInstance.userId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: job.id,
    status: job.status,
    logs: job.logs,
    errorMessage: job.errorMessage,
    startedAt: job.startedAt,
    completedAt: job.completedAt,
    accessUrl: job.installedApp.accessUrl,
  });
}
