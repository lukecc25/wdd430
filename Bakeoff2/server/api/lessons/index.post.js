import { requireAuthUser } from '../../lib/auth.js';
import { createUserLesson } from '../../lib/lessonData.js';
import { validateCreateLessonBody } from '../../lib/lessonValidation.js';
import { handleApiError } from '../../lib/apiErrors.js';

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuthUser(event);
    const body = await readBody(event).catch(() => ({}));
    const payload = validateCreateLessonBody(body);
    const lesson = await createUserLesson(user, payload);
    return { lesson };
  } catch (err) {
    handleApiError(err);
  }
});
