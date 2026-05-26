# CookQuest (Nuxt)

Gamified cooking education platform — bite-sized lessons with score tracking.

## Stack

- **Nuxt 4** (Vue 3, Nitro server)
- **MongoDB** + Mongoose
- **Clerk** (`@clerk/nuxt`)

## Setup

```bash
cd Bakeoff2
npm install
cp .env.example .env
```

Set in `.env` ([Clerk API keys](https://dashboard.clerk.com/~/api-keys)):

```env
NUXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NUXT_CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=mongodb+srv://...
```

```bash
npm run dev
```

Open http://localhost:3000.

## Project layout

All app source lives under `app/` (Nuxt 4). Server code under `server/`.

```
Bakeoff2/
├── app/
│   ├── app.vue
│   ├── pages/index.vue
│   ├── components/       # CookQuestApp, LessonGrid, LessonRunner, ProfileCard
│   ├── composables/      # useAuthedFetch, useClerkDisplayName
│   └── assets/css/
├── server/
│   ├── api/
│   ├── middleware/clerk.js
│   ├── lib/
│   ├── models/
│   └── plugins/seed.js
└── nuxt.config.ts
```

## API

| Method | Path | Auth |
| ------ | ---- | ---- |
| GET | `/api/lessons` | public |
| GET | `/api/lessons/:id` | public |
| GET | `/api/lessons/progress` | Clerk |
| POST | `/api/lessons/:id/attempts` | Clerk |
| GET | `/api/users/me` | Clerk |
