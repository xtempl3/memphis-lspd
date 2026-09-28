import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
export async function GET() {
  const r = await requireRole("ADMIN"); if ("error" in r) return r.error;
  const logs = await db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  const users = await db.user.findMany({ select: { id: true, username: true } });
  const n = Object.fromEntries(users.map(x => [x.id, x.username]));
  return Response.json(logs.map(l => ({ ...l, actor: n[l.actorId] ?? l.actorId })));
}
