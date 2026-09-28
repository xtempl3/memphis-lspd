import { redirect } from "next/navigation";
import { getUser } from "./auth";
import { db } from "./db";
import Shell from "@/components/Shell";
export async function Page({ children, min }: { children: (u: any) => React.ReactNode; min?: string }) {
  const u = await getUser(); if (!u) redirect("/login");
  const lv = ["OFFICER","SUPERVISOR","COMMAND","ADMIN"];
  if (min && lv.indexOf(u.role) < lv.indexOf(min)) redirect("/");
  const unread = await db.notification.count({ where: { userId: u.id, read: false } });
  return <Shell user={u} unread={unread}><main>{children(u)}</main></Shell>;
}
