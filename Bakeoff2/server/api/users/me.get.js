import connectDB from '../../lib/db.js';
import { requireAuthUser } from '../../lib/auth.js';
import { handleApiError } from '../../lib/apiErrors.js';

export default defineEventHandler(async (event) => {
  try {
    await connectDB();
    const user = await requireAuthUser(event);

    return {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        totalScore: user.totalScore,
      },
    };
  } catch (err) {
    if (err?.message?.includes('DATABASE_URL')) {
      throw createError({
        statusCode: 503,
        statusMessage: 'Database not configured',
        data: { message: err.message },
      });
    }
    handleApiError(err);
  }
});
