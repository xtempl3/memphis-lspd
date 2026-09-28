"use client";
import { useState } from "react";
import Link from "next/link";
import Bell from "./Bell";
export default function Shell({ user, unread, children }: any) {
  const [open, setOpen] = useState(false);
  const staff = user.role !== "OFFICER";
  return <div className="shell">
    <aside className={"side" + (open ? " open" : "")} onClick={() => setOpen(false)}>
      <h1>LSPD PORTAL</h1><small>Los Santos Police Department</small>
      <h4>Основное</h4><Link href="/">Главная</Link><Link href="/my">Мои заявления</Link><Link href="/apply/promotion">Повышения</Link><Link href="/apply/dept_transfer">Переводы</Link>
      <h4>Секретариат</h4><Link href="/#forms">Электронные заявления</Link><Link href="/apply/weapons">Спец. вооружение</Link>
      <h4>Информация</h4><Link href="/#rules">Правила и информация</Link>
      {staff && <><h4>Руководство</h4><Link href="/command">Панель руководства</Link></>}
      {user.role === "ADMIN" && <Link href="/admin">Администрирование</Link>}
      <div className="me"><img src={user.avatar ?? ""} alt=""/><div><b>{user.username}</b><div className="mute">{user.rank} · #{user.badge ?? "—"}</div></div></div>
    </aside>
    <div><button className="btn ghost burger" onClick={() => setOpen(true)}>Меню</button>
      <div style={{ textAlign: "right", padding: "14px 28px 0" }} className="mute"><Bell unread={unread}/></div>{children}</div>
  </div>;
}
