import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminFromRequest } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { ipAddress, sshUser, sshPassword, status, name, memory, vcpu, disk } = body;

  const vps = await db.vpsInstance.update({
    where: { id },
    data: {
      ...(ipAddress !== undefined && { ipAddress }),
      ...(sshUser !== undefined && { sshUser }),
      ...(sshPassword !== undefined && { sshPassword }),
      ...(status !== undefined && { status }),
      ...(name !== undefined && { name }),
      ...(memory !== undefined && { memory }),
      ...(vcpu !== undefined && { vcpu }),
      ...(disk !== undefined && { disk }),
    },
  });
  return NextResponse.json(vps);
}
