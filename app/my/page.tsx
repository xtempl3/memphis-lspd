import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Shell from "@/components/Shell";
import { FORMS, STATUS_RU } from "@/lib/types";
export default async function My() {
  const u = await getUser(); if (!u) redirect("/login");
  const unread = await db.notification.count({ where: { userId: u.id, read: false } });
  const list = await db.application.findMany({ where: { authorId: u.id }, orderBy: { createdAt: "desc" }, include: { reviewer: true } });
  return <Shell user={u} unread={unread}><main><h2>Мои заявления</h2>
    {list.length === 0 ? <p className="mute">Заявлений пока нет. Выберите тип на главной.</p> :
    <div style={{ overflowX: "auto" }}><table><thead><tr><th>Тип</th><th>Дата</th><th>Статус</th><th>Рассмотрел</th><th>Комментарий</th><th>Файлы</th></tr></thead><tbody>{list.map(a =>
      <tr key={a.id}><td>{FORMS[a.type]?.title}</td><td>{a.createdAt.toLocaleDateString("ru")}</td><td><span className="badge">{STATUS_RU[a.status]}</span></td>
      <td>{a.reviewer?.username ?? "—"}</td><td>{a.comment ?? "—"}</td><td>{a.files.map((f, i) => <a key={f} href={f} target="_blank" style={{ color: "var(--blue)", marginRight: 6 }}>#{i + 1}</a>)}</td></tr>)}</tbody></table></div>}</main></Shell>;
}
