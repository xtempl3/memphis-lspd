import { db } from "@/lib/db";
import { getUser, requireRole } from "@/lib/auth";
import { STATUS_RU } from "@/lib/types";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const u = await getUser(); if (!u) return Response.json({ error: "unauthorized" }, { status: 401 });
  const a = await db.application.findUnique({ where: { id: params.id }, include: { history: true, author: true } });
  if (!a || (a.authorId !== u.id && u.role === "OFFICER")) return Response.json({ error: "not found" }, { status: 404 });
  return Response.json(a);
}
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const r = await requireRole("SUPERVISOR"); if ("error" in r) return r.error;
  const { status, comment } = await req.json();
  if (!(status in STATUS_RU) || status === "PENDING") return Response.json({ error: "bad status" }, { status: 400 });
  const a = await db.application.update({ where: { id: params.id }, data: { status, comment, reviewerId: r.user.id,
    history: { create: { actorId: r.user.id, action: status, comment } } } });
  await db.notification.create({ data: { userId: a.authorId, text: `Ваше заявление: ${STATUS_RU[status].toLowerCase()}.` } });
  return Response.json(a);
}
