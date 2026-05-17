---
description: "Actionable tasks for CookQuest feature implementation"
---

# Tasks: CookQuest

**Input**: `specs/cookquest/plan.md`, `specs/cookquest/spec.md`

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Create repository layout and README in application/ and client/ per plan (`application/`, `client/`, `infrastructure/`, `specs/cookquest/`)
- [ ] T002 Initialize backend project with package manifest and basic entry (`application/package.json`, `application/src/app.js`)
- [ ] T003 Initialize frontend project with package manifest and main app (`client/package.json`, `client/src/app.jsx`)
- [ ] T004 [P] Add linting, formatting and editor config files (`.eslintrc.js`, `.prettierrc`, `.editorconfig`)
- [ ] T005 [P] Add CI workflow skeleton for tests and lint (`.github/workflows/ci.yaml`)

---

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T006 Setup database configuration and migration tool (`application/src/config/database.js`, `application/migrations/`)
- [ ] T007 [P] Implement authentication framework (register/login/logout) and session/token handling (`application/src/services/authService.js`, `application/src/api/auth.js`)
- [ ] T008 [P] Create base API routing and middleware (`application/src/api/index.js`, `application/src/middleware/auth.js`, `application/src/middleware/errorHandler.js`)
- [ ] T009 Create core entities that all stories depend on: `User`, `Level`, `Lesson` models (`application/src/models/user.js`, `application/src/models/level.js`, `application/src/models/lesson.js`)
- [ ] T010 [P] Add basic tests setup and fixtures (`application/tests/unit/setup.js`, `client/tests/setup.js`)

---

## Phase 3: User Story 1 - Learn a Lesson (Priority: P1) 🎯 MVP

**Goal**: Allow a learner to open and complete a short lesson, receive immediate feedback, and record score.

**Independent Test**: A signed-in user can fetch a lesson, submit answers to questions, get per-question feedback, and see score persisted in progress.

- [ ] T011 [P] [US1] Create `LessonQuestion` and `LessonContent` models (`application/src/models/lessonQuestion.js`, `application/src/models/lessonContent.js`)
- [ ] T012 [US1] Implement `GET /api/lessons` and `GET /api/lessons/:lessonId` endpoints (`application/src/api/lessons.js`)
- [ ] T013 [US1] Implement scoring logic and `POST /api/lessons/:lessonId/attempts` endpoint to grade answers and return feedback (`application/src/services/scoringService.js`, `application/src/api/lessons.js`)
- [ ] T014 [US1] Add LevelService and level calculation helper (`application/src/services/levelService.js`)
- [ ] T015 [US1] Persist lesson attempt and score in `ProgressRecord` (`application/src/models/progressRecord.js`, `application/src/services/progressService.js`)
- [ ] T016 [US1] Create frontend `Lesson` page and components: `client/src/pages/LessonPage.jsx`, `client/src/components/LessonQuestion.jsx`, `client/src/components/FeedbackDialog.jsx`)
- [ ] T017 [US1] Wire frontend to backend: API client methods for lessons and attempts (`client/src/services/api/lessons.js`)
- [ ] T018 [US1] Add immediate feedback UI and score delta display on the feedback component (`client/src/components/FeedbackDialog.jsx`)
- [ ] T019 [US1] Add unit tests for scoring and feedback (`application/tests/unit/test_scoring.js`)
- [ ] T020 [US1] Add integration test for lesson flow: fetch → submit → receive feedback → persist progress (`application/tests/integration/test_lesson_flow.js`)

---

## Phase 4: User Story 2 - Track Progress (Priority: P2)

**Goal**: Save and display learner progress including completion, scores, and streaks.

**Independent Test**: A user can complete a lesson, return later, and see saved progress and streaks on the dashboard.

- [ ] T021 [P] [US2] Create `ProgressRecord` and `StreakEvent` models (`application/src/models/progressRecord.js`, `application/src/models/streakEvent.js`)
- [ ] T022 [US2] Implement streak calculation logic and `/api/streaks` endpoint (`application/src/services/streakService.js`, `application/src/api/streaks.js`)
- [ ] T023 [US2] Implement `/api/progress` and `/api/progress/:lessonId` endpoints (`application/src/api/progress.js`)
- [ ] T024 [US2] Create frontend `Dashboard` page and components: `client/src/pages/Dashboard.jsx`, `client/src/components/StreakCounter.jsx`, `client/src/components/ProgressSummary.jsx`)
- [ ] T025 [US2] Add API client methods for progress and streaks (`client/src/services/api/progress.js`)
- [ ] T026 [US2] Add integration test for progress persistence and dashboard display (`application/tests/integration/test_progress_dashboard.js`)

---

## Phase 5: User Story 3 - Practice Challenge Modes (Priority: P3)

**Goal**: Provide short challenge activities (ingredient selection, timing, swaps) with scoring and explanations.

**Independent Test**: A user can complete a challenge activity and receive a scored result with explanations.

- [ ] T027 [P] [US3] Create `Challenge` and `ChallengeAttempt` models (`application/src/models/challenge.js`, `application/src/models/challengeAttempt.js`)
- [ ] T028 [US3] Implement `POST /api/challenges/:challengeId/attempts` endpoint and scoring for challenges (`application/src/api/challenges.js`, `application/src/services/challengeService.js`)
- [ ] T029 [US3] Create frontend `Challenge` component and page: `client/src/pages/ChallengePage.jsx`, `client/src/components/ChallengeCard.jsx`)
- [ ] T030 [US3] Add integration test for challenge flow (`application/tests/integration/test_challenge_flow.js`)

---

## Phase 6: Admin, Authoring & Content Management

- [ ] T031 [P] Implement admin endpoints for creating and editing lessons (`application/src/api/admin/lessons.js`)
- [ ] T032 [P] Build a minimal authoring UI for creating lessons (`client/src/pages/AdminLessons.jsx`, `client/src/components/LessonEditor.jsx`)
- [ ] T033 [P] Add lesson versioning and history tracking (`application/src/services/contentVersionService.js`)

---

## Phase 7: Polish, Testing & Deployment

- [ ] T034 [P] Add accessibility attributes and keyboard navigation for core UI (`client/src/components/*` updates)
- [ ] T035 [P] Add end-to-end tests for registration → lesson → dashboard flows (`client/tests/e2e/`)
- [ ] T036 [P] Performance tuning: lazy load lessons and cache frequently used lookups (`client/src/utils/cache.js`, `application/src/utils/cache.js`)
- [ ] T037 [P] Security hardening: input validation, rate limiting, CSRF protection (`application/src/middleware/security.js`)
- [ ] T038 [P] Write `quickstart.md` developer setup and run instructions (`specs/cookquest/quickstart.md`)
- [ ] T039 [P] Write API docs for implemented endpoints (`specs/cookquest/contracts/` or `specs/cookquest/api.md`)
- [ ] T040 [P] Run accessibility audit and document results (`specs/cookquest/accessibility-report.md`)

---

## Dependencies & Execution Order

- Phase 1 (Setup) -> Phase 2 (Foundational) -> Phase 3+ (User Stories)
- User stories are independent after foundational phase completes. Prefer US1 as MVP deliverable.

## Parallel Opportunities

- Setup tasks T004, T005 and foundational `[P]` tasks T007, T008, T010 can run in parallel.
- Within each story, model creation tasks marked `[P]` can run in parallel across different team members.

## Summary

- **Total tasks**: 40
- **Tasks for US1 (P1)**: 10 (T011-T020)
- **Tasks for US2 (P2)**: 6 (T021-T026)
- **Tasks for US3 (P3)**: 4 (T027-T030)
- **MVP suggestion**: Complete Phase 1, Phase 2, and Phase 3 (User Story 1) to produce a demoable MVP.

---

Generated from: specs/cookquest/plan.md and specs/cookquest/spec.md
