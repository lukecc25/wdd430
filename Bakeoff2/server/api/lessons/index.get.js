import { getLessonsList, getViewerUserId } from '../../lib/lessonData.js';
import { handleApiError } from '../../lib/apiErrors.js';

export default defineEventHandler(async (event) => {
  try {
    const viewerUserId = await getViewerUserId(event);
    return await getLessonsList(viewerUserId);
  } catch (err) {
    handleApiError(err);
  }
});
