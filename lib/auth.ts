import { cookies } from "next/headers";
import { db } from "./db";
import { redirect } from "next/navigation";

export async function getSession() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("user_session")?.value;
  if (!userId) return null;
  return db.user.findUnique({ where: { id: userId } });
}

export async function requireAuth() {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin() {
  const user = await getSession();
  if (!user) redirect("/login");
  if (!user.isAdmin) redirect("/dashboard");
  return user;
}

export async function getSessionFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/user_session=([^;]+)/);
  if (!match) return null;
  const userId = match[1];
  return db.user.findUnique({ where: { id: userId } });
}

export async function requireAdminFromRequest(req: Request) {
  const user = await getSessionFromRequest(req);
  return user?.isAdmin ? user : null;
}
