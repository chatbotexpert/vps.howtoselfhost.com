import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminFromRequest } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  const order = await db.order.update({ where: { id }, data: { status } });

  if (status === "paid" && order.vpsInstanceId) {
    await db.vpsInstance.update({ where: { id: order.vpsInstanceId }, data: { status: "running" } });
  }

  return NextResponse.json(order);
}
