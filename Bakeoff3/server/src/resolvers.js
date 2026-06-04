import {
  getLessonsList,
  getLessonForQuiz,
  createUserLesson,
  submitAttempt,
  getProgress,
} from './lessonService.js';
import { validateCreateLessonInput } from './validateLesson.js';
import { gqlError } from './errors.js';

function requireUser(context) {
  if (!context.user) gqlError('Unauthorized', 'UNAUTHORIZED');
  return context.user;
}

function mapUser(user) {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    imageUrl: user.imageUrl,
    totalScore: user.totalScore ?? 0,
  };
}

export const resolvers = {
  Query: {
    lessons: (_, __, context) => getLessonsList(context.viewerUserId),
    lesson: (_, { id }, context) => getLessonForQuiz(id, context.viewerUserId),
    me: (_, __, context) => (context.user ? mapUser(context.user) : null),
    progress: (_, __, context) => {
      if (!context.viewerUserId) return [];
      return getProgress(context.viewerUserId);
    },
  },
  Mutation: {
    submitAttempt: async (_, { lessonId, answers }, context) => {
      const user = requireUser(context);
      return submitAttempt(user, lessonId, answers);
    },
    createLesson: async (_, { input }, context) => {
      const user = requireUser(context);
      const payload = validateCreateLessonInput(input);
      return createUserLesson(user, payload);
    },
  },
};
