import { getLessonForQuiz, getViewerUserId } from '../../lib/lessonData.js';
import { ApiHttpError, handleApiError } from '../../lib/apiErrors.js';

export default defineEventHandler(async (event) => {
  try {
    const lessonId = getRouterParam(event, 'lessonId');
    const viewerUserId = await getViewerUserId(event);
    const lesson = await getLessonForQuiz(lessonId, viewerUserId);
    if (!lesson) {
      throw new ApiHttpError(404, 'not_found', 'Lesson not found');
    }
    return lesson;
  } catch (err) {
    handleApiError(err);
  }
});
