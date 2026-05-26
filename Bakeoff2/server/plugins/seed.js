import connectDB from '../lib/db.js';
import seedLessons from '../lib/seedLessons.js';

export default defineNitroPlugin(async () => {
  if (!process.env.DATABASE_URL) {
    console.warn('[seed] DATABASE_URL not set — skipping lesson seed');
    return;
  }

  try {
    await connectDB();
    await seedLessons();
  } catch (err) {
    console.error('[seed] Failed to seed lessons:', err?.message || err);
  }
});
