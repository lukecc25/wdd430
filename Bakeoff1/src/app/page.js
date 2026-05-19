import { auth } from '@clerk/nextjs/server';
import CookQuestApp from '@/components/CookQuestApp';
import { getLessonsList, getProgressByClerkUserId } from '@/lib/lessonData';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { userId } = await auth();
  const [lessons, progress] = await Promise.all([
    getLessonsList(),
    getProgressByClerkUserId(userId),
  ]);

  return <CookQuestApp initialLessons={lessons} initialProgress={progress} />;
}
