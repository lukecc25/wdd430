# CookQuest

Gamified cooking education platform — learn practical kitchen skills through short, Duolingo-style lessons.

## Stack

- **Next.js** 15 (App Router)
- **MongoDB** + Mongoose
- **Clerk** (`@clerk/nextjs`)

## Setup

```bash
cd Bakeoff1
pnpm install
cp .env.example .env
```

Set in `.env`:

- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

```bash
pnpm dev
```

Open http://localhost:3000.

## Project layout

```
src/
├── app/              # pages, API routes, layout, styles
├── components/       # React UI
├── lib/              # db, auth, models, services, hooks
├── middleware.js
└── instrumentation.js
```

## API

| Method | Path | Auth |
| ------ | ---- | ---- |
| GET | `/api/lessons` | public |
| GET | `/api/lessons/:id` | public |
| GET | `/api/lessons/progress` | Clerk |
| POST | `/api/lessons/:id/attempts` | Clerk |
| GET | `/api/users/me` | Clerk |
