import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
export async function GET() {
  const u = await getUser(); if (!u) return Response.json({ error: "unauthorized" }, { status: 401 });
  return Response.json(await db.notification.findMany({ where: { userId: u.id }, orderBy: { createdAt: "desc" }, take: 20 }));
}
export async function POST() {
  const u = await getUser(); if (!u) return Response.json({ error: "unauthorized" }, { status: 401 });
  await db.notification.updateMany({ where: { userId: u.id, read: false }, data: { read: true } });
  return Response.json({ ok: true });
}
