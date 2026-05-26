import connectDB from './db.js';
import Lesson from '../models/Lesson.js';
import Attempt from '../models/Attempt.js';
import User from '../models/User.js';
import seedLessons, { lessonSeed } from './seedLessons.js';

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
  }));
}

function staticLessonForQuiz(lessonId) {
  const entry = lessonSeed.find((l) => l.slug === lessonId);
  if (!entry) return null;
  return stripAnswers({ ...entry, _id: entry.slug });
}

export async function getLessonsList() {
  try {
    await connectDB();
    const count = await Lesson.countDocuments();
    if (count === 0) {
      await seedLessons();
    }
    const lessons = await Lesson.find({})
      .select('title description difficulty slug')
      .lean();
    if (lessons.length > 0) {
      return lessons;
    }
  } catch (err) {
    console.error('[lessons] MongoDB unavailable, using static seed:', err?.message || err);
  }

  return staticLessonsList();
}

export async function getLessonForQuiz(lessonId) {
  try {
    await connectDB();
    let lesson =
      (await Lesson.findById(lessonId).lean()) ||
      (await Lesson.findOne({ slug: lessonId }).lean());
    if (!lesson) {
      const count = await Lesson.countDocuments();
      if (count === 0) await seedLessons();
      lesson =
        (await Lesson.findById(lessonId).lean()) ||
        (await Lesson.findOne({ slug: lessonId }).lean());
    }
    if (lesson) return stripAnswers(lesson);
  } catch (err) {
    console.error('[lessons] quiz load fallback:', err?.message || err);
  }

  return staticLessonForQuiz(lessonId);
}

export async function getProgressByUserId(userId) {
  if (!userId) return {};

  await connectDB();

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
