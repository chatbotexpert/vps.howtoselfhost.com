import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { updateContaboInstancePassword } from "@/lib/contabo";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await req.json();

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 });
    }

    // Await params here as per Next.js 15+ recommendations for async params if it's dynamic
    const { id } = await params;

    const vps = await db.vpsInstance.findUnique({
      where: { id },
    });

    if (!vps || vps.userId !== userId) {
      return NextResponse.json({ error: "VPS instance not found or unauthorized" }, { status: 404 });
    }

    if (!vps.contaboId) {
      return NextResponse.json({ error: "VPS is still provisioning. Cannot change password yet." }, { status: 400 });
    }

    // Call Contabo API to change password
    await updateContaboInstancePassword(vps.contaboId, newPassword);

    // Update database
    await db.vpsInstance.update({
      where: { id },
      data: { sshPassword: newPassword },
    });

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error: any) {
    console.error("Change VPS password error:", error);
    return NextResponse.json({ error: "Failed to change VPS password" }, { status: 500 });
  }
}
