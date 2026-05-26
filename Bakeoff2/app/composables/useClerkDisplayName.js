export function clerkWelcomeName(clerkUser) {
  if (!clerkUser) return 'Chef';
  if (clerkUser.username) return clerkUser.username;
  if (clerkUser.firstName) return clerkUser.firstName;
  if (clerkUser.fullName) return clerkUser.fullName;
  const email =
    clerkUser.primaryEmailAddress?.emailAddress ||
    clerkUser.emailAddresses?.[0]?.emailAddress;
  if (email) return email.split('@')[0];
  return 'Chef';
}

export function profileDisplayName(profile) {
  if (!profile) return '';
  const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
  return name || profile.email || '';
}

export function normalizeLessons(lessons) {
  return (lessons || []).map((l) => ({
    ...l,
    _id: l._id?.toString?.() ?? l._id,
  }));
}

export function useClerkDisplayName() {
  const { user } = useUser();
  const welcomeName = computed(() => clerkWelcomeName(user.value));
  return { user, welcomeName };
}
