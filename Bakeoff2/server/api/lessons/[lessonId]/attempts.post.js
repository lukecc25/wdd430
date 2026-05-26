import connectDB from '../../../lib/db.js';
import Lesson from '../../../models/Lesson.js';
import Attempt from '../../../models/Attempt.js';
import User from '../../../models/User.js';
import { requireAuthUser } from '../../../lib/auth.js';
import { gradeAttempt } from '../../../lib/lessonData.js';
import { ApiHttpError, handleApiError } from '../../../lib/apiErrors.js';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const user = await requireAuthUser(event);
    const lessonId = getRouterParam(event, 'lessonId');

    const lesson =
      (await Lesson.findById(lessonId)) ||
      (await Lesson.findOne({ slug: lessonId }));
    if (!lesson) {
      throw new ApiHttpError(404, 'not_found', 'Lesson not found');
    }

    const body = await readBody(event).catch(() => ({}));
    const { answers = [] } = body || {};
    const result = gradeAttempt(lesson, answers);

    const attempt = await Attempt.create({
      userId: user._id,
      lessonId: lesson._id,
      answers,
      score: result.score,
      totalPossible: result.totalPossible,
      feedback: result.feedback,
    });

    await User.findByIdAndUpdate(user._id, {
      $inc: { totalScore: result.score },
    });

    return {
      attemptId: attempt._id,
      score: result.score,
      totalPossible: result.totalPossible,
      feedback: result.feedback,
    };
  } catch (err) {
    handleApiError(err);
  }
});
