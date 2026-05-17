import { auth } from '@clerk/nextjs/server';
import { syncUserFromClerk } from '@/lib/userService';
import { ApiHttpError } from '@/lib/apiErrors';

export async function requireAuthUser() {
  const { userId } = await auth();
  if (!userId) {
    throw new ApiHttpError(401, 'unauthorized', 'Unauthorized');
  }
  return syncUserFromClerk(userId);
}
