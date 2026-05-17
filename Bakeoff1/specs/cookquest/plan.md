# Implementation Plan: CookQuest

**Branch**: `cookquest`  
**Date**: 2026-04-30  
**Spec**: [specs/cookquest/spec.md](./spec.md)

**Note**: This plan consolidates the CookQuest constitution and feature specification into a unified technical and governance roadmap.

## Summary

CookQuest is a gamified cooking education platform that teaches practical kitchen skills through short, Duolingo-style lessons. The platform focuses on ingredient substitutions, safe cooking temperatures, and recipe ingredient recognition, with score-based level progression and streak-based motivation.

The core value is enabling all ages, especially college students (18-30), to build real cooking confidence through personalized, mobile-first short daily sessions. Governance emphasizes culinary truth and safety, transparent feedback and scoring, and immediate level progression tied to demonstrated mastery.

## Technical Context

**Language/Version**: Node.js 18+ (backend) and Svelte (frontend) / TypeScript NEEDS CLARIFICATION on Python or alternative backend preference  
**Primary Dependencies**: Express.js or FastAPI (backend), Svelte + Svelte stores (frontend), socket.io for real-time updates  
**Storage**: PostgreSQL for user accounts, progress, and lesson content; Redis for sessions and real-time data  
**Testing**: Jest/Vitest (frontend), pytest or Jest (backend), Cypress for end-to-end  
**Target Platform**: Web application, mobile-responsive, works on iOS and Android via responsive design  
**Project Type**: Web application (separate frontend and backend)  
**Performance Goals**: 90th percentile response time under 200ms; support 1000 concurrent users; lesson load in under 1 second  
**Constraints**: Mobile-first design, accessibility (WCAG 2.1 AA minimum), offline-capable caching for lessons  
**Scale/Scope**: Initial MVP for up to 10k registered users, 50+ lessons across 3 topic areas (substitutions, temperatures, timing), expandable to 100+ lessons and multiple cuisines

## Constitution Check

**GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.**

### Principles Alignment

1. **Authenticated Learners, Personalized Paths**  
   ✓ PASS: Spec requires user authentication, persistent progress tracking, and personalized dashboard.

2. **Culinary Truth and Safety**  
   ✓ PASS: Spec requires validated cooking temperatures and safe preparation guidance; content must be sourced and reviewed.

3. **Lesson-Based Progression and Mastery**  
   ✓ PASS: Spec defines lessons, one-concept focus, mastery gating via score thresholds for level advancement, and level-based progression.

4. **Feedback, Scoring, and Streaks Must Be Transparent**  
   ✓ PASS: Spec requires immediate feedback after every answer, clear scoring rules, and streak tracking.

5. **Social Motivation Must Respect Learning**  
   ✓ PASS: Spec allows sharing progress and challenges but does not mandate leaderboards; social features are opt-in.

### Content Standards

✓ PASS: Spec includes LessonContent entity with versioning; lessons tie to multiple-choice or numeric questions with explanations and point values.

### Account, Progress, and Social Rules

✓ PASS: Spec includes User entity with level progression, ProgressRecord for per-lesson tracking, and optional sharing via `POST /api/shares/progress`.

### Development Workflow

✓ PASS: Spec defines independent user stories (P1-P3) that can be built and tested separately; implementation plan will include tests for authentication, progression logic, scoring, and streak behavior.

---

## Project Structure

### Documentation (this feature)

```text
specs/cookquest/
├── plan.md              # This file
├── spec.md              # Feature specification (user stories, requirements, data models, API endpoints)
├── research.md          # NEEDED: Technical research on stack choices, component libraries
├── data-model.md        # NEEDED: Detailed ER diagram and schema design
├── quickstart.md        # NEEDED: Developer setup and first-run instructions
├── contracts/           # NEEDED: OpenAPI/Swagger files for each endpoint
│   ├── auth.yml
│   ├── lessons.yml
│   ├── progress.yml
│   ├── levels.yml
│   └── challenges.yml
└── tasks.md             # NEEDED: Actionable task breakdown by user story
```

### Source Code (logical structure)

```text
application/
├── src/
│   ├── models/          # User, Lesson, ProgressRecord, Level, Challenge, StreakEvent
│   ├── services/        # auth, lesson, progress, scoring, leveling logic
│   ├── api/             # authentication, lessons, progress, levels, challenges, admin
│   ├── middleware/      # auth verification, error handling, request logging
│   ├── utils/           # helpers for scoring, streak calculation, level lookup
│   └── app             # application bootstrap
├── tests/
│   ├── unit/            # Service and utility unit tests
│   ├── integration/      # API endpoint tests
│   └── fixtures/        # Mock data and test users
└── config.example

client/
├── src/
│   ├── components/      # Lesson, Dashboard, FeedbackScreen, LevelBadge, StreakCounter
│   ├── pages/           # Home, LessonPage, ProgressPage, ProfilePage
│   ├── services/        # API client and state/session helpers
│   ├── hooks/           # user, lesson, progress, level hooks
│   ├── utils/           # formatters, validators, local storage helpers
│   └── app             # main app router and layout
├── tests/
│   ├── unit/            # component and hook unit tests
│   ├── integration/      # page-level integration tests
│   └── e2e/             # end-to-end tests
└── config.example

infrastructure/          # local development and deployment configuration
.gitignore
README.md
```

**Structure Decision**: Web application with separate service and client layers. Service exposes APIs; client provides interactive learning views. This keeps responsibilities clear and supports independent iteration during bakeoffs.

---

## Wireframes / Mockups

### Home / Dashboard

```text
+--------------------------------------------------+
| CookQuest                                        |
| Hello, Maya                                      |
| Streak: 5 days   Score: 840   Level 3           |
| Current Level: Saucy Starter                     |
|--------------------------------------------------|
| Continue Learning                                |
| [ Lesson: Ingredient Swaps  > ]                  |
|                                                  |
| Today's Review                                   |
| [ Safe Chicken Temperature ]                     |
| [ Prep Time Challenge ]                          |
|                                                  |
| Progress                                         |
| 72% complete | 18 lessons done | 4 weak areas    |
+--------------------------------------------------+
```

### Lesson Screen

```text
+--------------------------------------------------+
| Ingredient Substitution Lesson                   |
| Question 2 of 5                                  |
|--------------------------------------------------|
| What can replace buttermilk in a pinch?          |
|                                                  |
| ( ) Milk + lemon juice                           |
| ( ) Orange juice                                 |
| ( ) Water                                        |
| ( ) Heavy cream                                  |
|                                                  |
| [ Check Answer ]                                 |
+--------------------------------------------------+
```

### Feedback Screen

```text
+--------------------------------------------------+
| Correct!                                         |
| Milk + lemon juice works as a quick substitute. |
| Score +20   Streak maintained   Level +1 if     |
| threshold reached                                |
| [ Next Question ]                                |
+--------------------------------------------------+
```

## Governance Alignment

### Constitution Application to This Plan

- **Every feature traces back to learner journeys**: Each API endpoint and component maps to at least one user story (US1-US3).
- **Plans pass constitution checks**: Done (see Constitution Check section above).
- **Tests for core behaviors**: Tasks will include tests for authentication, progression logic, scoring, streak behavior, and level advancement.
- **Lesson and scoring immutability**: Content updates must preserve existing progress records; edited lessons treated as content updates with validation.
- **Mobile-first, accessible, fast**: Frontend MUST use responsive design, keyboard navigation, screen reader support (ARIA labels), and lazy loading.
- **Transparent feedback and scoring**: Feedback screen shows correct/incorrect explanation and score deltas; level advancement must display immediately.

## Required Features Checklist (Course Rubric)

### Minimum Features and Functionality

- **Clear user purpose/problem**: Teach practical, safe cooking skills in a structured and motivating format.
- **Distinct interfaces/views**: Dashboard, Lesson, Feedback, Progress, Profile, and Challenge views.
- **Users and authentication**: Account registration, login/logout, and profile access.
- **CRUD for at least two data models**:
  - Lessons and lesson questions (create/read/update by authorized users; read for learners)
  - User progress records (create/update as users complete lessons; read by users/admins)
- **Responsive design**: Mobile-first layouts with desktop support.

### Advanced Feature Commitment

The bakeoff MVP will include at least one advanced feature:

- **Role-Based Access Control (RBAC)** for learner and content-author/admin roles.

Additional advanced options in scope (time permitting):

- Real-time challenge updates
- Progressive Web App offline support
- Multi-language localization

### MVP Core Feature Set (Baseline Delivery)

- User authentication and account access
- Personalized dashboard with progress and streak tracking
- Score-based level progression with changing level names
- Short, lesson-based learning flow
- Ingredient substitution lessons and challenges
- Safe cooking temperature lessons for meats
- Prep time and cook time estimation activities
- Recipe ingredient selection challenges
- Scoring and immediate feedback after every answer
- Lesson completion tracking and progression unlocks

### Team Workflow Requirements

- Use Git and GitHub for version control with regular, meaningful contributions from each team member.
- Track work in a project management board with prioritized tasks by user story.
- Follow agile practices with weekly sprint goals and short planning/retrospective notes.

### README Deliverables (Required)

Project README must include:

- Project description
- Team members
- Setup and installation instructions
- API documentation
- Known issues or future improvements

This plan and associated spec files provide the source material for all required README sections.

### Amendments and Versioning

Constitution is currently at v1.1.0 (2026-04-28). This plan does not propose changes; it operationalizes existing principles. Any future changes to level names, score thresholds, or scoring rules require constitution review and will follow PATCH/MINOR versioning accordingly.

---

## Phase Breakdown

### Phase 0: Research & Architecture
- [ ] Compare stack options for the service layer
- [ ] Compare UI framework and component library options
- [ ] Design database schema (ER diagram in data-model.md)
- [ ] Prototype API contracts (OpenAPI files in contracts/)
- [ ] Define local development environment setup

### Phase 1: Foundation & Auth (Blocks All User Stories)
- [ ] Setup service project structure and middleware
- [ ] Implement user authentication (registration, login, session/token flow)
- [ ] Setup persistent data storage and session handling
- [ ] Implement Session / User entity and persistence
- [ ] Create `/api/auth/*` and `/api/me` endpoints
- [ ] Setup client auth context and protected routes
- [ ] Add login/register pages and navigation

### Phase 2: Lessons & Core Progression (P1 User Story)
- [ ] Create Lesson, LessonQuestion, LessonContent entities
- [ ] Implement `/api/lessons` and `/api/lessons/:lessonId` endpoints
- [ ] Implement scoring logic and `/api/lessons/:lessonId/attempts` endpoint
- [ ] Create LevelService and Level entity for score → level mapping
- [ ] Implement level calculation and `/api/levels` endpoint
- [ ] Build frontend Lesson component and feedback flow
- [ ] Build Level indicator and progress display

### Phase 3: Progress & Streaks (P2 User Story)
- [ ] Create ProgressRecord and StreakEvent entities
- [ ] Implement streak calculation logic
- [ ] Implement `/api/progress` and `/api/progress/:lessonId` endpoints
- [ ] Implement `/api/streaks` endpoint
- [ ] Build frontend Dashboard and progress visualization
- [ ] Add streak counter and next-lesson recommendation logic

### Phase 4: Challenges & Practice (P3 User Story)
- [ ] Create Challenge entity (recipe ingredient, timing, etc.)
- [ ] Implement ChallengeAttempt tracking
- [ ] Implement `/api/challenges/:challengeId/attempts` endpoint
- [ ] Build frontend Challenge component and result display
- [ ] Integrate challenges into lesson progression

### Phase 5: Social & Sharing (Additional Features)
- [ ] Implement `/api/shares/progress` for progress snapshots
- [ ] Implement `/api/challenges/invite` for challenge invites
- [ ] Build sharing UI (copy link, email share, social share)

### Phase 6: Admin & Lesson Editing (Additional Features)
- [ ] Implement `/api/admin/lessons` (POST) and `/api/admin/lessons/:lessonId` (PUT)
- [ ] Add author workflow for creating/editing lessons
- [ ] Build lesson editor UI (frontend admin panel)
- [ ] Add lesson versioning and history tracking

### Phase 7: Polish, Testing & Deployment
- [ ] Complete end-to-end testing
- [ ] Performance optimization (lazy loading, caching, database indexes)
- [ ] Accessibility audit (WCAG 2.1 AA compliance)
- [ ] Security review (input validation, rate limiting, CSRF protection)
- [ ] Documentation (API docs, developer setup, user guide)
- [ ] Deploy to staging and production environments

---

## Initial Data Models (Proposal Level)

- **User**: identity, profile, authentication status, streak, score, and current level
- **Lesson**: title, topic, difficulty, ordering, and publish state
- **LessonQuestion**: prompt, answer options, correct answer, explanation, point value
- **ProgressRecord**: learner completion status, attempts, best score, timestamps
- **Level**: level number/name and score threshold ranges
- **ChallengeAttempt**: challenge type, result details, score, and completion timestamps
- **StreakEvent**: daily streak changes for transparency and history

These models satisfy required multi-model CRUD scope and support authentication, progression, and challenge features.

## API Endpoints Needed for MVP and Extensions

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/me`
- `GET /api/lessons`
- `GET /api/lessons/:lessonId`
- `POST /api/lessons/:lessonId/attempts`
- `GET /api/progress`
- `GET /api/progress/:lessonId`
- `POST /api/challenges/:challengeId/attempts`
- `GET /api/streaks`
- `GET /api/recommendations`
- `POST /api/admin/lessons`
- `PUT /api/admin/lessons/:lessonId`
- `POST /api/shares/progress`
- `POST /api/challenges/invite`

These endpoints align directly with the learner journeys in `spec.md` and the account/progress/social rules in the constitution.

---

## Edge Cases and Validation Rules

- Repeated incorrect answers should trigger explanatory feedback and review recommendations rather than silent score penalties.
- Recipes with multiple valid substitutions must accept all approved correct variants.
- Temperature responses that are near safe thresholds must follow explicit tolerance and safety warning rules.
- New users with no history should receive a starter path and neutral streak/progress messaging.
- Updated lesson content must preserve prior learner records and maintain versioned correctness history.

## Success Criteria

- **SC-001**: A new user can register, sign in, and start a lesson in under 3 minutes.
- **SC-002**: At least 80% of first-time users can complete one full lesson without assistance.
- **SC-003**: The system shows saved progress and streak data correctly after a user returns.
- **SC-004**: Users receive feedback immediately after each lesson response.
- **SC-005**: The MVP includes working lessons for substitutions, temperatures, and cooking time estimation.
- **SC-006**: When a user's score crosses a configured threshold, the system increases their level by 1 and updates the level name immediately.

---

## Complexity Tracking

| Aspect | Why Needed | Notes |
|--------|-----------|-------|
| Separate frontend/backend | Allows independent scaling and team specialization | Could combine into full-stack monolith, but team likely wants separation of concerns |
| PostgreSQL + Redis | PostgreSQL for relational data (users, progress); Redis for sessions and real-time updates | SQLite insufficient for concurrent users; in-memory sessions needed for performance |
| Level progression tied to score thresholds | Gamification and motivation | Could use simple sequential levels; dynamic thresholds allow balanced progression |
| Lesson versioning and content immutability | Safety and data integrity per constitution | Could drop versioning; but culinary safety principle requires audit trail |
| Mobile-responsive design | Target audience is college students on phones | Could build native mobile apps; but web responsive is MVP and faster |

---

## Testing Strategy

### Unit Tests
- Scoring calculations (correct/incorrect, point values, level thresholds)
- Streak logic (daily tracking, resets, increments)
- Level lookup and advancement
- Progress record state transitions
- Content validation (source/review status, safe temperature ranges, substitution scope limits)
- Share/privacy rule validation (only minimum required social data exposed)

### Integration Tests
- Auth flow: register → login → persist session → access protected routes
- Lesson flow: fetch lesson → submit answer → receive feedback → update progress
- Level advancement: score progression → threshold hit → level increase → name change
- Streak flow: daily logins → streak increment → break detection → notification
- Challenge flow: fetch challenge → submit result → score update

### End-to-End Tests
- New user: register → onboarding → complete first lesson → see level 1 badge
- Returning user: login → see previous progress → continue where left off
- Level progression: complete lessons until score threshold → see level increase
- Sharing: complete lesson → copy share link → share with friend

### Accessibility Tests
- Keyboard navigation (Tab, Enter, Escape)
- Screen reader (ARIA labels, semantic HTML)
- Color contrast (WCAG AA: 4.5:1 for text, 3:1 for graphics)
- Mobile usability (touch targets, responsive layouts)

---

## Next Steps

1. **Execute Phase 0 research**: Finalize stack choices and database design (data-model.md).
2. **Generate tasks.md**: Break each phase into actionable tasks with dependencies.
3. **Start Phase 1**: Setup backend, authentication, and frontend infrastructure.
4. **Run quickstart.md**: Verify developers can clone, install, and run locally within 10 minutes.

---

## References

- **Constitution**: [.specify/memory/constitution.md](../../../.specify/memory/constitution.md)
- **Specification**: [spec.md](spec.md)
- **Task Breakdown**: [tasks.md](tasks.md) (to be generated)
- **Data Model**: [data-model.md](data-model.md) (to be generated)
- **Developer Quickstart**: [quickstart.md](quickstart.md) (to be generated)
