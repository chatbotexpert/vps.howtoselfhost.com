import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { cancelContaboInstance } from "@/lib/contabo";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_session")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const vps = await db.vpsInstance.findUnique({
      where: { id },
    });

    if (!vps || vps.userId !== userId) {
      return NextResponse.json({ error: "VPS instance not found or unauthorized" }, { status: 404 });
    }

    if (vps.contaboId) {
      // Call Contabo API to cancel instance
      await cancelContaboInstance(vps.contaboId);
    }

    // Delete from database
    await db.vpsInstance.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "VPS deleted successfully" });
  } catch (error: any) {
    console.error("Delete VPS error:", error);
    return NextResponse.json({ error: "Failed to delete VPS" }, { status: 500 });
  }
}
