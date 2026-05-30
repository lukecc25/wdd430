import Attempt from '../../../models/Attempt.js';
import User from '../../../models/User.js';
import { requireAuthUser } from '../../../lib/auth.js';
import { getLessonForGrading, gradeAttempt } from '../../../lib/lessonData.js';
import { handleApiError } from '../../../lib/apiErrors.js';

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuthUser(event);
    const lessonId = getRouterParam(event, 'lessonId');

    const lesson = await getLessonForGrading(lessonId, user._id);

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
