"use client";
import { useEffect, useState } from "react";
export default function Bell({ unread }: { unread: number }) {
  const [open, setOpen] = useState(false); const [n, setN] = useState<any[]>([]); const [cnt, setCnt] = useState(unread);
  useEffect(() => { if (open) { fetch("/api/notifications").then(r => r.json()).then(setN); fetch("/api/notifications", { method: "POST" }).then(() => setCnt(0)); } }, [open]);
  return <div style={{ position: "relative", display: "inline-block" }}>
    <button className="btn ghost" onClick={() => setOpen(!open)}>Уведомления{cnt > 0 ? ` (${cnt})` : ""}</button>
    {open && <div className="card" style={{ position: "absolute", right: 0, width: 300, padding: 12, zIndex: 9, textAlign: "left" }}>
      {n.length === 0 ? <span className="mute">Новых уведомлений нет</span> : n.map(x => <div key={x.id} style={{ padding: "6px 0", borderBottom: "1px solid var(--line)" }}>{x.text}<div className="mute" style={{ fontSize: 12 }}>{new Date(x.createdAt).toLocaleString("ru")}</div></div>)}</div>}</div>;
}
