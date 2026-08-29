import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdminFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const admin = await requireAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plans = await db.vpsPlan.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(plans);
}

export async function POST(req: Request) {
  const admin = await requireAdminFromRequest(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, slug, description, price, cpu, ram, storage, bandwidth, popular, active, sortOrder } = body;

  if (!name || !slug || !price) {
    return NextResponse.json({ error: "name, slug, and price are required" }, { status: 400 });
  }

  const plan = await db.vpsPlan.create({
    data: { name, slug, description: description || "", price: parseFloat(price), cpu: cpu || "", ram: ram || "", storage: storage || "", bandwidth: bandwidth || "", popular: !!popular, active: active !== false, sortOrder: sortOrder || 0 },
  });
  return NextResponse.json(plan, { status: 201 });
}
