import { clerkClient } from '@clerk/nuxt/server';
import User from '../models/User.js';

export async function syncUserFromClerk(clerkUserId, event) {
  let user = await User.findOne({ clerkUserId });
  if (user) return user;

  const clerkUser = await clerkClient(event).users.getUser(clerkUserId);
  const primaryEmail =
    clerkUser.emailAddresses.find((e) => e.id === clerkUser.primaryEmailAddressId)
      ?.emailAddress ||
    clerkUser.emailAddresses[0]?.emailAddress ||
    `user-${clerkUserId}@cookquest.local`;

  try {
    user = await User.create({
      clerkUserId,
      email: primaryEmail,
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      imageUrl: clerkUser.imageUrl || '',
    });
  } catch (err) {
    if (err?.code === 11000) {
      user = await User.findOne({ clerkUserId });
      if (user) return user;
    }
    throw err;
  }

  return user;
}
