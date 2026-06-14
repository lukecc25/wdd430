# CookQuest (Bakeoff 3)

Gamified cooking lessons — ported from Bakeoff2 with a new stack:

| Layer | Technology |
| ----- | ---------- |
| Frontend | **Vue 3** + Vite (client-side rendering SPA) + Vue Router |
| API | **GraphQL** (Apollo Server) |
| Database | **Firebase** (Firestore + Firebase Auth) |

Auth is **Firebase only** (email/password). There is no Clerk and no `CLERK_*` / `NUXT_*` env vars in this project.

The **client** is a pure **client-side rendered** app: `index.html` loads one JavaScript bundle; Vue mounts in the browser and then calls GraphQL. There is no server-side HTML generation for pages.

## Project layout

```
Bakeoff3/
├── client/          # Vue SPA (Apollo Client → GraphQL)
│   └── src/
│       ├── components/
│       ├── views/
│       ├── composables/
│       └── graphql/
└── server/          # Apollo Server + Firebase Admin
    └── src/
        ├── schema.js
        ├── resolvers.js
        ├── lessonService.js   # Firestore
        └── data/lessonSeed.js
```

## Firebase setup (project: **cookquest-3b152**)

Console: [cookquest-3b152](https://console.firebase.google.com/project/cookquest-3b152)

1. **Authentication** → Sign-in method → enable **Email/Password** (required) and optionally **Google** (supported in the app header).
2. **Firestore Database** → **Create database** (required — the server cannot start without this):
   - Pick a region (e.g. `us-central1`).
   - Start in **test mode** for class work (lock down rules before production).
   - This enables the [Cloud Firestore API](https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=cookquest-3b152) for the project.
   - If you see `PERMISSION_DENIED` / `SERVICE_DISABLED` on `npm run dev`, the database was never created — complete this step and wait 1–2 minutes.
3. **Web app config** (client):
   - Project settings (gear) → **Your apps** → add a **Web** app if you do not have one.
   - Copy the `firebaseConfig` values into `client/.env` (see `client/.env.example`).  
     CookQuest uses **Firestore** via the GraphQL server — you do **not** need Realtime Database (`databaseURL` / `cookquest-3b152-default-rtdb`).
4. **Admin SDK** (GraphQL server):
   - Project settings → **Service accounts** → **Generate new private key**.
   - From the downloaded JSON, set `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY` in `server/.env`.

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
# Edit both files with your real keys (never commit .env)
```

Firestore collections (created automatically):

- `lessons` — official + user-created lessons
- `users` — profile + `totalScore` (synced on first sign-in)
- `attempts` — quiz submissions

## Setup

```bash
cd Bakeoff3
npm run install:all

# Copy env files
cp .env.example server/.env
cp .env.example client/.env
# Edit both with your Firebase values

# Terminal 1 — GraphQL API
npm run dev:server

# Terminal 2 — Vue app (proxies /graphql → :4000)
npm run dev:client
```

Or run **both** from `Bakeoff3/` in one terminal:

```bash
npm install
npm run dev
```

Open http://localhost:5173

Official lessons from Bakeoff2 are upserted into Firestore on server start (by `slug`). You can also run:

```bash
npm run seed
```

## GraphQL API

Endpoint: `http://localhost:4000/graphql`

| Operation | Description |
| --------- | ----------- |
| `query { lessons }` | List lessons (public + yours when signed in) |
| `query { lesson(id) }` | Lesson for quiz (no answers) |
| `query { me }` | Current user profile |
| `query { progress }` | Best scores per lesson |
| `mutation { submitAttempt }` | Grade quiz + save attempt |
| `mutation { createLesson }` | Create private or shared lesson |

Send `Authorization: Bearer <Firebase ID token>` for authenticated operations.

## Deploy notes

- Deploy **server** and **client** separately (e.g. Render for API, static host for Vue).
- Set `VITE_GRAPHQL_URL` to your production GraphQL URL when building the client.
- Enable Email/Password auth and configure Firestore security rules for production.

## Troubleshooting

### `PERMISSION_DENIED: Cloud Firestore API has not been used...`

Firestore is not set up yet for your Firebase project. In [Firebase Console → Firestore](https://console.firebase.google.com/project/cookquest-3b152/firestore), click **Create database**, then restart the server after a minute or two.
