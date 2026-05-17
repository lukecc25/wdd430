# Feature Specification: CookQuest

**Feature Branch**: `cookquest`  
**Created**: 2026-04-30  
**Status**: Draft  
**Input**: User description: "CookQuest is a site that merges the learning style of Duo Lingo and needed cooking skills together. Here the user will learn what ingredients can be substituted with eachother as well as common knowledge of what temperatures different meats must be cooked at and to in order for it to be safe to consume. Along with these skills there are fun activities where you must figure out what specific ingredients are needed for certain recipes."

## Project Description

CookQuest is a gamified cooking education site that teaches practical kitchen skills through short, Duolingo-style lessons and challenges. The platform focuses on ingredient substitutions, safe cooking temperatures, and recipe ingredient recognition, with additional practice around prep time and cook time estimation.

The experience should feel lightweight, encouraging, and repeatable so users can build real cooking confidence through short daily sessions.

## Target Audience

CookQuest is designed for people who want to learn or improve cooking skills. It is intended for all ages, but the primary audience is ages 18 to 30, especially college students and young adults who need practical, everyday cooking knowledge.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Learn a Lesson (Priority: P1)

As a learner, I want to complete a short cooking lesson so I can practice one specific skill at a time.

**Why this priority**: Core learning is the main value of the product.

**Independent Test**: A user can open a lesson, answer the questions, and receive a score and feedback without using any other feature.

**Acceptance Scenarios**:

1. **Given** a user is signed in, **When** they start a lesson on ingredient substitutions, **Then** they can answer each prompt and receive feedback after every answer.
2. **Given** a user completes a temperature lesson, **When** the lesson ends, **Then** the system records completion and displays their score.

---

### User Story 2 - Track Progress (Priority: P2)

As a learner, I want my progress to be saved so I can see what I have learned and what I still need to practice.

**Why this priority**: Progress tracking supports retention and personalized learning.

**Independent Test**: A user can complete a lesson, return later, and see their saved progress and streak.

**Acceptance Scenarios**:

1. **Given** a user has completed lessons, **When** they view their dashboard, **Then** they see lesson completion, accuracy, and streak information.
2. **Given** a user misses a day, **When** they return, **Then** the system updates their streak and shows their next recommended lesson.
3. **Given** a user reaches a score threshold, **When** the new total score is saved, **Then** the system increases their level by 1 and updates the displayed level name.

---

### User Story 3 - Practice Challenge Modes (Priority: P3)

As a learner, I want short challenge activities so I can practice recipe ingredients, swaps, and timing in a game-like format.

**Why this priority**: Challenge modes make learning more engaging and repeatable.

**Independent Test**: A user can complete a challenge activity without needing to create content or share progress.

**Acceptance Scenarios**:

1. **Given** a user starts a recipe ingredient challenge, **When** they choose the correct items, **Then** the system scores the attempt and explains mistakes.
2. **Given** a user starts a timing challenge, **When** they estimate prep or cook time, **Then** the system tells them whether they were correct and why.

---

### Edge Cases

- What happens when a user answers incorrectly multiple times in a row?
- How does the system handle recipes with multiple valid ingredient substitutions?
- What happens if a temperature answer is close but not exact?
- How does the system handle a user who has no streak or no prior progress yet?
- What happens if lesson content is updated after a user has already completed it?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow users to create accounts and sign in.
- **FR-002**: The system MUST save personalized user progress, including lesson completion, scores, and streak data.
- **FR-003**: The system MUST support lesson-based progression so learners move through content in a controlled order.
- **FR-004**: The system MUST provide lessons for ingredient substitutions, cooking temperatures, and prep or cook time estimation.
- **FR-005**: The system MUST provide immediate feedback after each answer.
- **FR-006**: The system MUST calculate and display a score for each lesson or challenge.
- **FR-007**: The system MUST track streaks to encourage continued learning.
- **FR-008**: The system MUST allow learners to complete short challenge activities based on cooking scenarios.
- **FR-009**: The system MUST allow users to view their progress dashboard.
- **FR-010**: The system MUST support lesson content that can be created and edited by authorized authors or admins.
- **FR-011**: The system MUST increase a user's level when their score reaches defined thresholds and MUST change the displayed level name at each new level.

### MVP Core Features

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

### Additional Features

- Lesson creation and editing tools for authorized content authors
- Social sharing of progress milestones
- Challenges that let users compare completion status with friends
- Spaced review recommendations based on weak areas
- Badges or achievement-style rewards
- Notifications or reminders to keep streaks active
- More recipe packs, cuisines, and difficulty levels
- More level tiers and themed level names

### Key Entities *(include if feature involves data)*

- **User**: An authenticated learner with profile data, streaks, progress history, and preferences.
- **Level**: A progression tier tied to score thresholds and a display name such as Level 1, Microwaved Meal Preparer.
- **Lesson**: A short learning unit focused on one skill area, such as substitutions or temperatures.
- **Challenge**: A practice activity tied to a lesson or topic with a score and outcome.
- **ProgressRecord**: A record of lesson completion, scores, attempts, and mastery state.
- **LessonContent**: The question, answer set, explanation, and metadata used to present a lesson.

## Wireframes or Mockups of the User Interface

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
| Question 2 of 5                                 |
|--------------------------------------------------|
| What can replace buttermilk in a pinch?         |
|                                                  |
| ( ) Milk + lemon juice                           |
| ( ) Orange juice                                 |
| ( ) Water                                       |
| ( ) Heavy cream                                 |
|                                                  |
| [ Check Answer ]                                 |
+--------------------------------------------------+
```

### Feedback Screen

```text
+--------------------------------------------------+
| Correct!                                         |
| Milk + lemon juice works as a quick substitute. |
| Score +20   Streak maintained   Level +1 if threshold reached |
| [ Next Question ]                                |
+--------------------------------------------------+
```

## Initial Data Models

- **User**
  - id
  - email
  - displayName
  - passwordHash
  - createdAt
  - lastLoginAt
  - streakCount
  - currentScore
  - levelNumber
  - levelName
  - nextLevelScore

- **Lesson**
  - id
  - title
  - topicType
  - difficulty
  - orderIndex
  - isPublished
  - createdAt
  - updatedAt

- **LessonQuestion**
  - id
  - lessonId
  - prompt
  - questionType
  - answerOptions
  - correctAnswer
  - explanation
  - pointValue

- **ProgressRecord**
  - id
  - userId
  - lessonId
  - status
  - bestScore
  - attempts
  - completedAt
  - lastSeenAt

- **Level**
  - id
  - levelNumber
  - levelName
  - minScore
  - maxScore
  - displayOrder
  - themeColor

- **ChallengeAttempt**
  - id
  - userId
  - challengeType
  - score
  - startedAt
  - completedAt
  - resultDetails

- **StreakEvent**
  - id
  - userId
  - eventDate
  - eventType
  - streakBefore
  - streakAfter

## API Endpoints You Will Need to Implement

- `POST /api/auth/register` - create a new user account
- `POST /api/auth/login` - sign in a user
- `POST /api/auth/logout` - end the session
- `GET /api/me` - return the signed-in user profile
- `GET /api/lessons` - list available lessons
- `GET /api/lessons/:lessonId` - get lesson details and questions
- `POST /api/lessons/:lessonId/attempts` - submit lesson answers and receive score feedback
- `GET /api/progress` - return the user's progress summary
- `GET /api/progress/:lessonId` - return progress for a specific lesson
- `POST /api/challenges/:challengeId/attempts` - submit a challenge result
- `GET /api/streaks` - return current streak and streak history
- `GET /api/recommendations` - return personalized next lessons or review items
- `POST /api/admin/lessons` - create a lesson
- `PUT /api/admin/lessons/:lessonId` - edit a lesson
- `POST /api/shares/progress` - create a shareable progress snapshot
- `POST /api/challenges/invite` - create a challenge invite for another user

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new user can register, sign in, and start a lesson in under 3 minutes.
- **SC-002**: At least 80% of first-time users can complete one full lesson without assistance.
- **SC-003**: The system shows saved progress and streak data correctly after a user returns.
- **SC-004**: Users receive feedback immediately after each lesson response.
- **SC-005**: The MVP includes working lessons for substitutions, temperatures, and cooking time estimation.
- **SC-006**: When a user's score crosses a configured threshold, the system increases their level by 1 and updates the level name immediately.
