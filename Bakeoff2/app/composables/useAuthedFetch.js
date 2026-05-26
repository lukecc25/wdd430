/**
 * Authenticated $fetch using Clerk session token (@clerk/nuxt).
 */
export function useAuthedFetch() {
  const { isLoaded, getToken } = useAuth();
  const clerk = useClerk();

  async function resolveToken() {
    if (typeof getToken === 'function') {
      const token = await getToken();
      if (token) return token;
    }

    const session = clerk.value?.session ?? clerk.session;
    if (session && typeof session.getToken === 'function') {
      return session.getToken();
    }

    return null;
  }

  async function waitForSessionToken(maxAttempts = 20) {
    for (let i = 0; i < maxAttempts; i += 1) {
      if (!isLoaded.value) {
        await new Promise((r) => setTimeout(r, 50));
        continue;
      }
      const token = await resolveToken();
      if (token) return token;
      await new Promise((r) => setTimeout(r, 50));
    }
    return null;
  }

  return async (url, options = {}) => {
    const token = await waitForSessionToken();
    if (!token) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Not signed in or session not ready',
      });
    }

    return $fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };
}
