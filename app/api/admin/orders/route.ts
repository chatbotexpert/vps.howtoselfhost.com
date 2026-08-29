import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const admin = await requireAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { email: true, firstName: true, lastName: true } }, vpsInstance: { select: { name: true, region: true } } },
  });
  return NextResponse.json(orders);
}
