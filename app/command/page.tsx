"use client";
import { useEffect, useState } from "react";
import { STATUS_RU, FORMS } from "@/lib/types";
export default function Command() {
  const [list, setList] = useState<any[]>([]); const [c, setC] = useState<Record<string, string>>({});
  const [st, setSt] = useState(""); const [ty, setTy] = useState(""); const [open, setOpen] = useState("");
  const load = () => fetch("/api/applications?all=1").then(r => r.json()).then(setList);
  useEffect(() => { load(); }, []);
  async function act(id: string, status: string) {
    await fetch(`/api/applications/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status, comment: c[id] }) }); load();
  }
  const shown = list.filter(a => (!st || a.status === st) && (!ty || a.type === ty));
  return <main style={{ padding: 28 }}><h2>Панель руководства</h2>
    <div style={{ display: "flex", gap: 10, margin: "14px 0" }}>
      <select value={st} onChange={e => setSt(e.target.value)}><option value="">Все статусы</option>{Object.entries(STATUS_RU).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
      <select value={ty} onChange={e => setTy(e.target.value)}><option value="">Все типы</option>{Object.entries(FORMS).map(([k, f]) => <option key={k} value={k}>{f.title}</option>)}</select></div>
    <div style={{ overflowX: "auto" }}><table><tbody>{shown.map(a => <>
      <tr key={a.id}><td><a href="#" onClick={e => { e.preventDefault(); setOpen(open === a.id ? "" : a.id); }}>{FORMS[a.type]?.title}</a><div className="mute">{a.author.username}</div></td>
      <td><span className="badge">{STATUS_RU[a.status]}</span></td>
      <td><input placeholder="Комментарий" onChange={e => setC({ ...c, [a.id]: e.target.value })}/></td>
      <td style={{ whiteSpace: "nowrap" }}><button className="btn" onClick={() => act(a.id, "APPROVED")}>Одобрить</button>{" "}
        <button className="btn ghost" onClick={() => act(a.id, "CHANGES_REQUESTED")}>Правки</button>{" "}
        <button className="btn ghost" onClick={() => act(a.id, "REJECTED")}>Отклонить</button></td></tr>
      {open === a.id && <tr key={a.id + "d"}><td colSpan={4} style={{ background: "#10131a" }}>
        {Object.entries(a.data).map(([k, v]) => <div key={k}><span className="mute">{FORMS[a.type]?.fields.find(f => f.name === k)?.label ?? k}:</span> {String(v)}</div>)}
        <div>{a.files.map((f: string, i: number) => <a key={f} href={f} target="_blank" style={{ color: "var(--blue)", marginRight: 8 }}>Файл {i + 1}</a>)}</div>
        <h4 className="mute" style={{ margin: "10px 0 4px" }}>История</h4>
        {a.history.map((h: any) => <div key={h.id} className="mute">{new Date(h.createdAt).toLocaleString("ru")} — {h.action}{h.comment ? `: ${h.comment}` : ""}</div>)}</td></tr>}</>)}</tbody></table></div></main>;
}
