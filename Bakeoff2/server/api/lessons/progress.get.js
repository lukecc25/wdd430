import { requireAuthUser } from '../../lib/auth.js';
import { getProgressByUserId } from '../../lib/lessonData.js';
import { handleApiError } from '../../lib/apiErrors.js';

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuthUser(event);
    const progress = await getProgressByUserId(user._id);
    return { progress };
  } catch (err) {
    handleApiError(err);
  }
});
