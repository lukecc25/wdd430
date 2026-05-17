export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs' || !process.env.DATABASE_URL) {
    return;
  }

  try {
    const connectDB = (await import('@/lib/db')).default;
    const seedLessons = (await import('@/lib/seedLessons')).default;
    await connectDB();
    await seedLessons();
  } catch (err) {
    console.warn('[instrumentation] startup skipped:', err.message);
  }
}
