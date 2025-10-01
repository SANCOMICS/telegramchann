# Telegram Channel Clone (Next.js + Prisma + SQLite)

A minimal Telegram-channel-like app with:
- Next.js 14 + TypeScript + TailwindCSS
- Prisma ORM + SQLite
- REST API routes (`/api/messages`)
- Two pages:
  - `/` (public channel viewer)
  - `/charrrdmin` (management: post messages)

## Quickstart

```bash
npm install

# Initialize DB and generate client
npx prisma migrate dev --name init

# Seed sample messages
npx prisma db seed

# Start dev server
npm run dev
```

Open:
- http://localhost:3000 — public channel
- http://localhost:3000/charrrdmin — admin composer

## Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

## Notes
- SQLite keeps data in `telegram.db` in project root.
- To reset DB: delete `telegram.db` then re-run migrate/seed.
