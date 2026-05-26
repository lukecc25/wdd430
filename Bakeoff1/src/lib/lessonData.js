import connectDB from '@/lib/db';
import Lesson from '@/lib/models/Lesson';
import Attempt from '@/lib/models/Attempt';
import User from '@/lib/models/User';

export async function getLessonsList() {
  await connectDB();
  return Lesson.find({}, 'title description difficulty slug').lean();
}

export async function getLessonForQuiz(lessonId) {
  await connectDB();
  const lesson = await Lesson.findById(lessonId).lean();
  if (!lesson) return null;

  lesson.questions = lesson.questions.map(({ correctIndex, explanation, ...rest }) => rest);
  return lesson;
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

export async function getProgressByClerkUserId(clerkUserId) {
  if (!clerkUserId) return {};

  await connectDB();
  const user = await User.findOne({ clerkUserId }).lean();
  if (!user) return {};

  return getProgressByUserId(user._id);
}
