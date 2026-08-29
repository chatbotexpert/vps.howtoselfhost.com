import { notFound } from "next/navigation";
import { getApp } from "@/lib/apps";
import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import AppInstaller from "./AppInstaller";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApp(slug);
  return { title: app ? `Install ${app.name}` : "Not Found" };
}

export default async function AppInstallerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const app = getApp(slug);
  if (!app) notFound();

  const user = await requireAuth();

  const myVps = await db.vpsInstance.findMany({
    where: { userId: user.id, status: "running" },
    select: { id: true, name: true, ipAddress: true, sshUser: true },
  });

  const previousInstalls = await db.installedApp.findMany({
    where: { appSlug: slug, vpsInstance: { userId: user.id } },
    include: { installJob: { select: { status: true, logs: true } }, vpsInstance: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return <AppInstaller app={app} myVps={myVps} previousInstalls={previousInstalls} />;
}
