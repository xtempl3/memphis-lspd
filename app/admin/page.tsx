"use client";
import { useEffect, useState } from "react";
const RANKS = ["Officer I","Officer II","Officer III","Corporal","Sergeant","Lieutenant","Captain","Major"];
export default function Admin() {
  const [u, setU] = useState<any[]>([]); const [deps, setDeps] = useState<any[]>([]); const [log, setLog] = useState<any[]>([]); const [nd, setNd] = useState({ code: "", name: "" });
  const load = () => { fetch("/api/admin/users").then(r => r.json()).then(setU); fetch("/api/departments").then(r => r.json()).then(setDeps); fetch("/api/admin/audit").then(r => r.json()).then(setLog); };
  useEffect(load, []);
  const J = { "Content-Type": "application/json" };
  const patch = async (id: string, body: any) => { await fetch("/api/admin/users", { method: "PATCH", headers: J, body: JSON.stringify({ id, ...body }) }); load(); };
  const addDep = async () => { await fetch("/api/departments", { method: "POST", headers: J, body: JSON.stringify(nd) }); setNd({ code: "", name: "" }); load(); };
  return <main style={{ padding: 28 }}><h2>Пользователи</h2><div style={{ overflowX: "auto" }}><table><tbody>{u.map(x => <tr key={x.id}>
    <td>{x.username}<div className="mute">{x.discordId}</div></td>
    <td><select value={x.role} onChange={e => patch(x.id, { role: e.target.value })}>{["OFFICER","SUPERVISOR","COMMAND","ADMIN"].map(r => <option key={r}>{r}</option>)}</select></td>
    <td><select value={x.rank} onChange={e => patch(x.id, { rank: e.target.value })}>{RANKS.map(r => <option key={r}>{r}</option>)}</select></td>
    <td><select value={x.departmentId ?? ""} onChange={e => patch(x.id, { departmentId: e.target.value })}><option value="">Без отдела</option>{deps.map(d => <option key={d.id} value={d.id}>{d.code}</option>)}</select></td>
    <td><input defaultValue={x.badge ?? ""} placeholder="Badge" onBlur={e => patch(x.id, { badge: e.target.value })}/></td></tr>)}</tbody></table></div>
    <h2 style={{ marginTop: 32 }}>Отделы</h2>{deps.map(d => <div key={d.id}>{d.code} — {d.name}</div>)}
    <div style={{ display: "flex", gap: 8, marginTop: 10 }}><input placeholder="Код" value={nd.code} onChange={e => setNd({ ...nd, code: e.target.value })}/><input placeholder="Название" value={nd.name} onChange={e => setNd({ ...nd, name: e.target.value })}/><button className="btn" onClick={addDep}>Добавить отдел</button></div>
    <h2 style={{ marginTop: 32 }}>Журнал действий</h2>{Array.isArray(log) && log.map(l => <div key={l.id} className="mute">{new Date(l.createdAt).toLocaleString("ru")} · {l.actor}: {l.action}</div>)}</main>;
}
