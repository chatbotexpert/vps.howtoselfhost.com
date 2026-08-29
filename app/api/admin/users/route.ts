import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const admin = await requireAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, firstName: true, lastName: true, isAdmin: true, createdAt: true, _count: { select: { vpsInstances: true, orders: true } } },
  });
  return NextResponse.json(users);
}

export async function PUT(req: Request) {
  const admin = await requireAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, isAdmin } = await req.json();
  const user = await db.user.update({ where: { id }, data: { isAdmin: !!isAdmin } });
  return NextResponse.json({ id: user.id, isAdmin: user.isAdmin });
}
