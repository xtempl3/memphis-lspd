"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FORMS } from "@/lib/types";
export default function Apply({ params }: { params: { type: string } }) {
  const f = FORMS[params.type]; const r = useRouter();
  const [d, setD] = useState<Record<string, string>>({}); const [err, setErr] = useState(""); const [files, setFiles] = useState<File[]>([]); const [busy, setBusy] = useState(false);
  if (!f) return <main>Форма не найдена</main>;
  async function send() {
    setBusy(true); setErr(""); const urls: string[] = [];
    for (const f of files) { const fd = new FormData(); fd.append("file", f); const u = await fetch("/api/upload", { method: "POST", body: fd }); if (!u.ok) { setErr((await u.json()).error); setBusy(false); return; } urls.push((await u.json()).url); }
    const res = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: params.type, data: d, files: urls }) });
    setBusy(false); res.ok ? r.push("/my") : setErr("Не удалось отправить. Войдите заново и повторите.");
  }
  return <main style={{ margin: "0 auto", padding: 28, maxWidth: 640 }}><h2>{f.title}</h2><p className="mute">{f.desc}</p>
    {f.fields.map(x => <div key={x.name}><label>{x.label}</label>{x.area ? <textarea rows={4} onChange={e => setD({ ...d, [x.name]: e.target.value })}/> : <input onChange={e => setD({ ...d, [x.name]: e.target.value })}/>}</div>)}
    <label>Доказательства / скриншоты (до 4 МБ каждый)</label><input type="file" accept="image/*" multiple onChange={e => setFiles(Array.from(e.target.files ?? []).slice(0, 8))}/>
    {err && <p style={{ color: "#ff6b6b" }}>{err}</p>}<br/><button className="btn" disabled={busy} onClick={send}>Отправить заявление</button></main>;
}
