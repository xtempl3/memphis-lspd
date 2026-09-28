import Link from "next/link";
import { Page } from "@/lib/page";
import { FORMS } from "@/lib/types";
export default function Home() {
  return <Page>{(u: any) => { const days = Math.floor((Date.now() - u.rankSince.getTime()) / 864e5);
    const groups = ["Электронные заявления", "Секретариат", "Отделы"];
    return <>
      <h2>Добро пожаловать, {u.username}</h2>
      <p className="mute">Внутренняя система заявлений и отчетности LSPD · Центральный патрульный дивизион</p>
      <div className="stats"><div className="stat"><span className="mute">Текущий ранг</span><b>{u.rank}</b></div><div className="stat"><span className="mute">Дней в ранге</span><b>{days}</b></div></div>
      <div id="forms">{groups.map(g => <section key={g}><h2 style={{ fontSize: 17, margin: "22px 0 12px" }}>{g}</h2>
        <div className="grid">{Object.entries(FORMS).filter(([, f]) => f.group === g).map(([k, f]) =>
          <Link key={k} href={`/apply/${k}`} className="card"><div className="img"/><div className="t"><b>{f.title}</b><span className="mute">{f.desc}</span></div></Link>)}</div></section>)}</div>
      <section id="rules"><h2 style={{ fontSize: 17, margin: "28px 0 8px" }}>Правила и информация</h2><p className="mute">Добавьте здесь регламенты департамента.</p></section></>; }}</Page>;
}
