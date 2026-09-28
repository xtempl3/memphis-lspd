import { db } from "@/lib/db";
import { getUser, requireRole } from "@/lib/auth";
const DEFAULTS = [["CPD","Central Patrol Division"],["SWAT","SWAT"],["DB","Detective Bureau"],["TD","Traffic Division"],["TRN","Training Division"]];
export async function GET() {
  if (!(await getUser())) return Response.json({ error: "unauthorized" }, { status: 401 });
  if ((await db.department.count()) === 0) await db.department.createMany({ data: DEFAULTS.map(([code, name]) => ({ code, name })) });
  return Response.json(await db.department.findMany({ orderBy: { code: "asc" } }));
}
export async function POST(req: Request) {
  const r = await requireRole("ADMIN"); if ("error" in r) return r.error;
  const { code, name } = await req.json();
  if (!code || !name) return Response.json({ error: "bad data" }, { status: 400 });
  const d = await db.department.create({ data: { code: String(code).slice(0, 12).toUpperCase(), name: String(name).slice(0, 80) } });
  await db.auditLog.create({ data: { actorId: r.user.id, action: `CREATE_DEPARTMENT ${d.code}` } });
  return Response.json(d, { status: 201 });
}
