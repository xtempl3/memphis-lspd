import { db } from "@/lib/db";
import { requireRole, RANKS } from "@/lib/auth";

export async function GET() {
  const r = await requireRole("ADMIN"); if ("error" in r) return r.error;
  return Response.json(await db.user.findMany({ include: { department: true }, orderBy: { createdAt: "asc" } }));
}
export async function PATCH(req: Request) {
  const r = await requireRole("ADMIN"); if ("error" in r) return r.error;
  const { id, role, rank, badge, departmentId } = await req.json();
  const data: any = {};
  if (role && ["OFFICER","SUPERVISOR","COMMAND","ADMIN"].includes(role)) data.role = role;
  if (rank && RANKS.includes(rank)) { data.rank = rank; data.rankSince = new Date(); }
  if (badge !== undefined) data.badge = String(badge).slice(0, 10);
  if (departmentId !== undefined) data.departmentId = departmentId || null;
  const u = await db.user.update({ where: { id }, data });
  await db.auditLog.create({ data: { actorId: r.user.id, action: `UPDATE_USER ${id} ${JSON.stringify(data)}` } });
  return Response.json(u);
}
