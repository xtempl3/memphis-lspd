import { NextAuthOptions, getServerSession } from "next-auth";
import Discord from "next-auth/providers/discord";
import { db } from "./db";
import type { Role } from "@prisma/client";

export const RANKS = ["Officer I","Officer II","Officer III","Corporal","Sergeant","Lieutenant","Captain","Major"];
const LEVEL: Record<Role, number> = { OFFICER: 0, SUPERVISOR: 1, COMMAND: 2, ADMIN: 3 };

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [Discord({ clientId: process.env.DISCORD_CLIENT_ID!, clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    authorization: { params: { scope: "identify" } } })],
  callbacks: {
    async signIn({ profile }: any) {
      const id = profile.id as string;
      const avatar = profile.avatar ? `https://cdn.discordapp.com/avatars/${id}/${profile.avatar}.png` : null;
      const boot = (process.env.BOOTSTRAP_ADMIN_IDS ?? "").split(",").map(s => s.trim());
      await db.user.upsert({ where: { discordId: id },
        update: { username: profile.username, avatar },
        create: { discordId: id, username: profile.username, avatar, role: boot.includes(id) ? "ADMIN" : "OFFICER" } });
      return true;
    },
    async jwt({ token, profile }: any) { if (profile) token.discordId = profile.id; return token; },
    async session({ session, token }: any) { session.discordId = token.discordId; return session; },
  },
  pages: { signIn: "/login" },
};

/** Серверная проверка: всегда читает пользователя и роль из БД, а не из токена. */
export async function getUser() {
  const s: any = await getServerSession(authOptions);
  if (!s?.discordId) return null;
  return db.user.findUnique({ where: { discordId: s.discordId }, include: { department: true } });
}
export async function requireRole(min: Role) {
  const u = await getUser();
  if (!u) return { error: Response.json({ error: "unauthorized" }, { status: 401 }) } as const;
  if (LEVEL[u.role] < LEVEL[min]) return { error: Response.json({ error: "forbidden" }, { status: 403 }) } as const;
  return { user: u } as const;
}
