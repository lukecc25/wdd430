import { getLessonsList } from '../../lib/lessonData.js';
import { handleApiError } from '../../lib/apiErrors.js';

export default defineEventHandler(async () => {
  try {
    return await getLessonsList();
  } catch (err) {
    handleApiError(err);
  }
});
