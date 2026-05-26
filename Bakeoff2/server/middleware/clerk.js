import { clerkMiddleware } from '@clerk/nuxt/server';

// Parses Clerk session cookies and Authorization Bearer tokens for all server routes.
export default clerkMiddleware();
