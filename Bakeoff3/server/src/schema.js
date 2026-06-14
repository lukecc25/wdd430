export const typeDefs = `#graphql
  type User {
    id: ID!
    email: String!
    firstName: String
    lastName: String
    imageUrl: String
    totalScore: Int!
  }

  type LessonListItem {
    id: ID!
    slug: String!
    title: String!
    description: String
    difficulty: String!
    isOfficial: Boolean!
    visibility: String!
    authorName: String
    isCommunity: Boolean!
  }

  type Question {
    id: ID
    prompt: String!
    options: [String!]!
  }

  type Lesson {
    id: ID!
    slug: String!
    title: String!
    description: String
    lessonContent: String
    difficulty: String!
    questions: [Question!]!
  }

  type ProgressEntry {
    lessonId: ID!
    score: Int!
    totalPossible: Int!
  }

  type FeedbackItem {
    questionId: String!
    correct: Boolean!
    points: Int!
    explanation: String!
  }

  type AttemptResult {
    attemptId: ID!
    score: Int!
    totalPossible: Int!
    feedback: [FeedbackItem!]!
  }

  input CreateQuestionInput {
    prompt: String!
    options: [String!]!
    correctIndex: Int!
    explanation: String
  }

  input CreateLessonInput {
    title: String!
    description: String
    lessonContent: String
    difficulty: String!
    visibility: String!
    questions: [CreateQuestionInput!]!
  }

  type Query {
    lessons: [LessonListItem!]!
    lesson(id: ID!): Lesson
    me: User
    progress: [ProgressEntry!]!
  }

  type Mutation {
    submitAttempt(lessonId: ID!, answers: [Int!]!): AttemptResult!
    createLesson(input: CreateLessonInput!): LessonListItem!
  }
`;
