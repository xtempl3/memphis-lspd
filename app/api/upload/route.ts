import { put } from "@vercel/blob";
import { getUser } from "@/lib/auth";
export async function POST(req: Request) {
  const u = await getUser(); if (!u) return Response.json({ error: "unauthorized" }, { status: 401 });
  const file = (await req.formData()).get("file") as File | null;
  if (!file || !/^image\/(png|jpe?g|webp|gif)$/.test(file.type) || file.size > 4_000_000)
    return Response.json({ error: "Только изображения до 4 МБ" }, { status: 400 });
  const b = await put(`uploads/${u.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`, file, { access: "public" });
  return Response.json({ url: b.url });
}
