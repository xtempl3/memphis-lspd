# LSPD Portal (Vercel)
Next.js 14 · NextAuth (Discord) · Prisma · PostgreSQL (Neon) · Vercel Blob.

## Деплой
1. Залейте проект на GitHub (приватный репозиторий).
2. vercel.com → Add New → Project → выберите репозиторий.
3. Vercel → Storage → Create Database → **Neon (Postgres)**; подключите к проекту, появится `DATABASE_URL`.
4. Vercel → Storage → Create → **Blob**; подключите к проекту (`BLOB_READ_WRITE_TOKEN`).
5. Project → Settings → Environment Variables: `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `NEXTAUTH_SECRET` (`openssl rand -base64 32`), `NEXTAUTH_URL` (= `https://ваш-домен`), `BOOTSTRAP_ADMIN_IDS` (ваш Discord ID).
6. Discord Developer Portal → OAuth2 → Redirects: `https://ваш-домен/api/auth/callback/discord`.
7. Создайте таблицы один раз с компьютера: `DATABASE_URL="<строка из Vercel>" npx prisma db push`.
8. Deploy. Войдите через Discord: вы станете ADMIN.

## Локально
`cp .env.example .env` → заполнить → `npm i` → `npx prisma db push` → `npm run dev`.
