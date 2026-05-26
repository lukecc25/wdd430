import { getAuth } from '@clerk/nuxt/server';
import connectDB from './db.js';
import { syncUserFromClerk } from './userService.js';
import { ApiHttpError } from './apiErrors.js';

export async function getClerkUserIdFromEvent(event) {
  if (typeof event.context.auth === 'function') {
    const authState = event.context.auth({ acceptsToken: 'session_token' });
    if (authState?.userId) return authState.userId;
  }
  const auth = await getAuth(event);
  return auth?.userId ?? null;
}

export async function requireAuthUser(event) {
  const userId = await getClerkUserIdFromEvent(event);

  if (!userId) {
    throw new ApiHttpError(401, 'unauthorized', 'Unauthorized');
  }

  await connectDB();
  return syncUserFromClerk(userId, event);
}
