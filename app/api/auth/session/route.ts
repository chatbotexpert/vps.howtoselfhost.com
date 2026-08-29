import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export async function GET() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;

  if (!userId) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const user = await db.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, firstName: true, lastName: true }
  });

  if (!user) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json({ authenticated: true, user }, { status: 200 });
}
