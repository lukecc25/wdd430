import { createClerkClient } from '@clerk/backend';
import User from '@/lib/models/User';

let clerk;

function getClerk() {
  if (!clerk) {
    if (!process.env.CLERK_SECRET_KEY) {
      throw new Error('CLERK_SECRET_KEY is not set in .env');
    }
    clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
  }
  return clerk;
}

export async function syncUserFromClerk(clerkUserId) {
  let user = await User.findOne({ clerkUserId });
  if (user) return user;

  const clerkUser = await getClerk().users.getUser(clerkUserId);
  const primaryEmail =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)?.emailAddress ||
    clerkUser.emailAddresses[0]?.emailAddress ||
    '';

  user = await User.create({
    clerkUserId,
    email: primaryEmail,
    firstName: clerkUser.firstName || '',
    lastName: clerkUser.lastName || '',
    imageUrl: clerkUser.imageUrl || '',
  });

  return user;
}
