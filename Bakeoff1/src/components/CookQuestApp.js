'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Show } from '@clerk/nextjs';
import ProfileCard from '@/components/ProfileCard';
import LessonGrid from '@/components/LessonGrid';
import LessonRunner from '@/components/LessonRunner';

export default function CookQuestApp({ initialLessons = [], initialProgress = {} }) {
  const router = useRouter();
  const [error, setError] = useState('');
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [profileRefresh, setProfileRefresh] = useState(0);

  function handleLessonSubmitted() {
    setProfileRefresh((n) => n + 1);
    router.refresh();
  }

  return (
    <>
      <p className="tagline">
        Bite-sized cooking lessons. Sign in to track your score.
      </p>

      <Show when="signed-out">
        <section>
          <h2>Sign in to start cooking</h2>
          <p className="muted">Use Sign in or Sign up in the header to get started.</p>
        </section>
      </Show>

      <Show when="signed-in">
        <section>
          <ProfileCard onError={setError} refreshKey={profileRefresh} />

          {activeLessonId ? (
            <LessonRunner
              lessonId={activeLessonId}
              onError={setError}
              onSubmitted={handleLessonSubmitted}
              onClose={() => setActiveLessonId(null)}
            />
          ) : (
            <>
              <h2>Lessons</h2>
              <LessonGrid
                lessons={initialLessons}
                progress={initialProgress}
                onSelectLesson={setActiveLessonId}
                refreshKey={profileRefresh}
              />
            </>
          )}
        </section>
      </Show>

      {error ? (
        <p className="app-error" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
}
