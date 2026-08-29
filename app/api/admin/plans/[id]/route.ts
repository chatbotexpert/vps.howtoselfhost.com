import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminFromRequest } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, slug, description, price, cpu, ram, storage, bandwidth, popular, active, sortOrder } = body;

  const plan = await db.vpsPlan.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(slug !== undefined && { slug }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price: parseFloat(price) }),
      ...(cpu !== undefined && { cpu }),
      ...(ram !== undefined && { ram }),
      ...(storage !== undefined && { storage }),
      ...(bandwidth !== undefined && { bandwidth }),
      ...(popular !== undefined && { popular: !!popular }),
      ...(active !== undefined && { active: !!active }),
      ...(sortOrder !== undefined && { sortOrder }),
    },
  });
  return NextResponse.json(plan);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.vpsPlan.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
