import { db } from "@/lib/db";
import { getUser } from "@/lib/auth";
import { FORMS } from "@/lib/types";

export async function GET(req: Request) {
  const u = await getUser(); if (!u) return Response.json({ error: "unauthorized" }, { status: 401 });
  const all = new URL(req.url).searchParams.get("all") === "1";
  if (all && u.role === "OFFICER") return Response.json({ error: "forbidden" }, { status: 403 });
  const list = await db.application.findMany({
    where: all ? {} : { authorId: u.id }, orderBy: { createdAt: "desc" },
    include: { history: all, author: { select: { username: true, discordId: true } }, reviewer: { select: { username: true } } } });
  return Response.json(list);
}
export async function POST(req: Request) {
  const u = await getUser(); if (!u) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { type, data, files } = await req.json();
  const okFiles = (Array.isArray(files) ? files : []).filter((f: any) => typeof f === "string" && /^https:\/\/[\w-]+\.public\.blob\.vercel-storage\.com\//.test(f)).slice(0, 8);
  const form = FORMS[type]; if (!form) return Response.json({ error: "bad type" }, { status: 400 });
  const clean: Record<string,string> = {};
  for (const f of form.fields) clean[f.name] = String(data?.[f.name] ?? "").slice(0, 4000);
  const app = await db.application.create({ data: { type, data: clean, files: okFiles, authorId: u.id,
    history: { create: { actorId: u.id, action: "CREATED" } } } });
  return Response.json(app, { status: 201 });
}
