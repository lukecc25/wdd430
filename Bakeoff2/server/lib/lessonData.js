import connectDB from './db.js';
import Lesson from '../models/Lesson.js';
import Attempt from '../models/Attempt.js';
import User from '../models/User.js';
import seedLessons, { lessonSeed } from './seedLessons.js';
import { getClerkUserIdFromEvent } from './auth.js';
import { ApiHttpError } from './apiErrors.js';

function stripAnswers(lesson) {
  lesson.questions = lesson.questions.map(({ correctIndex, explanation, ...rest }) => rest);
  return lesson;
}

function staticLessonsList() {
  return lessonSeed.map(({ slug, title, description, difficulty }) => ({
    _id: slug,
    slug,
    title,
    description,
    difficulty,
    isOfficial: true,
    visibility: 'public',
  }));
}

function staticLessonForQuiz(lessonId) {
  const entry = lessonSeed.find((l) => l.slug === lessonId);
  if (!entry) return null;
  return stripAnswers({ ...entry, _id: entry.slug, isOfficial: true });
}

function serializeLessonListItem(lesson) {
  return {
    _id: lesson._id,
    slug: lesson.slug,
    title: lesson.title,
    description: lesson.description,
    difficulty: lesson.difficulty,
    isOfficial: Boolean(lesson.isOfficial),
    visibility: lesson.visibility || 'public',
    authorName: lesson.authorName || '',
    isCommunity: !lesson.isOfficial && lesson.visibility === 'public',
  };
}

function canViewLesson(lesson, viewerUserId) {
  if (!lesson) return false;
  if (lesson.isOfficial || !lesson.createdBy) return true;
  if (lesson.visibility === 'public') return true;
  if (!viewerUserId) return false;
  return lesson.createdBy.toString() === viewerUserId.toString();
}

async function ensureSeeded() {
  await connectDB();
  const count = await Lesson.countDocuments({ isOfficial: true });
  if (count === 0) {
    await seedLessons();
  }
}

export async function getViewerUserId(event) {
  const clerkUserId = await getClerkUserIdFromEvent(event);
  if (!clerkUserId) return null;
  await connectDB();
  const user = await User.findOne({ clerkUserId }).lean();
  return user?._id ?? null;
}

export async function getLessonsList(viewerUserId = null) {
  try {
    await ensureSeeded();

    const or = [{ isOfficial: true }, { visibility: 'public', isOfficial: false }];
    if (viewerUserId) {
      or.push({ createdBy: viewerUserId, visibility: 'private' });
    }

    const lessons = await Lesson.find({ $or: or })
      .select('title description difficulty slug visibility createdBy isOfficial authorName')
      .sort({ isOfficial: -1, createdAt: -1 })
      .lean();

    if (lessons.length > 0) {
      return lessons.map(serializeLessonListItem);
    }
  } catch (err) {
    console.error('[lessons] MongoDB unavailable, using static seed:', err?.message || err);
  }

  return staticLessonsList();
}

export async function getLessonForQuiz(lessonId, viewerUserId = null) {
  try {
    await ensureSeeded();
    let lesson =
      (await Lesson.findById(lessonId).lean()) ||
      (await Lesson.findOne({ slug: lessonId }).lean());

    if (!lesson) {
      await seedLessons();
      lesson =
        (await Lesson.findById(lessonId).lean()) ||
        (await Lesson.findOne({ slug: lessonId }).lean());
    }

    if (lesson) {
      if (!canViewLesson(lesson, viewerUserId)) {
        throw new ApiHttpError(403, 'forbidden', 'This test is private');
      }
      return stripAnswers(lesson);
    }
  } catch (err) {
    if (err instanceof ApiHttpError) throw err;
    console.error('[lessons] quiz load fallback:', err?.message || err);
  }

  const staticLesson = staticLessonForQuiz(lessonId);
  if (staticLesson) return staticLesson;

  return null;
}

export async function getLessonForGrading(lessonId, viewerUserId = null) {
  await ensureSeeded();
  const lesson =
    (await Lesson.findById(lessonId)) || (await Lesson.findOne({ slug: lessonId }));

  if (!lesson) {
    throw new ApiHttpError(404, 'not_found', 'Lesson not found');
  }

  if (!canViewLesson(lesson, viewerUserId)) {
    throw new ApiHttpError(403, 'forbidden', 'This test is private');
  }

  return lesson;
}

export async function createUserLesson(user, payload) {
  await ensureSeeded();

  const slug = `custom-${user._id}-${Date.now()}`;
  const authorName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'Community chef';

  const lesson = await Lesson.create({
    slug,
    title: payload.title,
    description: payload.description,
    lessonContent: payload.lessonContent || payload.description,
    difficulty: payload.difficulty,
    questions: payload.questions,
    createdBy: user._id,
    visibility: payload.visibility,
    isOfficial: false,
    authorName,
  });

  return serializeLessonListItem(lesson.toObject());
}

export async function getProgressByUserId(userId) {
  if (!userId) return {};

  const attempts = await Attempt.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: '$lessonId',
        score: { $max: '$score' },
        totalPossible: { $max: '$totalPossible' },
      },
    },
  ]);

  return Object.fromEntries(
    attempts.map((a) => [
      a._id.toString(),
      { score: a.score, totalPossible: a.totalPossible },
    ])
  );
}

export function gradeAttempt(lesson, answers = []) {
  let score = 0;
  let totalPossible = 0;
  const feedback = lesson.questions.map((q, i) => {
    const a = answers[i];
    const correct = a === q.correctIndex;
    totalPossible += q.points;
    if (correct) score += q.points;
    return {
      questionId: q._id?.toString?.() ?? String(i),
      correct,
      points: correct ? q.points : 0,
      explanation:
        q.explanation || (correct ? 'Nice — correct!' : 'Not quite. Review and try again.'),
    };
  });
  return { score, totalPossible, feedback };
}

export async function getProgressByClerkUserId(clerkUserId) {
  if (!clerkUserId) return {};

  await connectDB();
  const user = await User.findOne({ clerkUserId }).lean();
  if (!user) return {};

  return getProgressByUserId(user._id);
}
