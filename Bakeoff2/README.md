# CookQuest (Nuxt — Static SPA)

Gamified cooking education platform — bite-sized lessons with score tracking.

**Bakeoff 2 architecture:** static client-side rendering (SPA). Pages are pre-built at compile time; Vue hydrates in the browser and loads data through REST API calls. The Nitro server provides the API layer only (JAMstack-style split).

## Stack

| Layer | Technology |
| ----- | ---------- |
| Frontend | **Nuxt 4** (Vue 3, `ssr: false`, client hydration) |
| API | **Nitro** server routes (`server/api/`) |
| Database | **MongoDB** + Mongoose |
| Auth | **Clerk** (`@clerk/nuxt`) |

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

On first startup, CookQuest **seeds 8 official lessons** into MongoDB if the database is empty.

## Build & deploy

```bash
# Full stack: static SPA + API server (default)
npm run build
npm run preview

# Static files only (for CDN / GitHub Pages front-end)
npm run generate
```

- **`npm run build`** — outputs a static client bundle plus a Node server that serves both the SPA and `/api/*` routes.
- **`npm run generate`** — outputs purely static files under `.output/public` (API requires a separate host).

## Custom lessons

Signed-in users can click **Create lesson** to build their own quiz:

- **Private** — only you can see and take it
- **Share with site** — appears for all signed-in users with a **Shared** badge

## Project layout

All app source lives under `app/` (Nuxt 4). Server code under `server/`.

```
Bakeoff2/
├── app/
│   ├── app.vue
│   ├── pages/index.vue      # client-only data fetching
│   ├── components/          # CookQuestApp, LessonGrid, LessonRunner, ProfileCard, TestCreator
│   ├── composables/         # useAuthedFetch, useClerkDisplayName
│   └── assets/css/
├── server/
│   ├── api/                 # REST API (lessons, progress, users)
│   ├── middleware/clerk.js
│   ├── lib/
│   ├── models/
│   └── plugins/seed.js
├── .github/agents/          # FrameworkStudent agent for learning mode
└── nuxt.config.ts           # ssr: false (static SPA)
```

## API

| Method | Path | Auth |
| ------ | ---- | ---- |
| GET | `/api/lessons` | public (includes shared community lessons; private when signed in) |
| POST | `/api/lessons` | Clerk — create your own lesson (private or shared) |
| GET | `/api/lessons/:id` | public (private lessons only for owner) |
| GET | `/api/lessons/progress` | Clerk |
| POST | `/api/lessons/:id/attempts` | Clerk |
| GET | `/api/users/me` | Clerk |
