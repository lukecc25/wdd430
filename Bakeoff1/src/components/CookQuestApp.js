'use client';

import { useState } from 'react';
import { Show } from '@clerk/nextjs';
import ProfileCard from '@/components/ProfileCard';
import LessonGrid from '@/components/LessonGrid';
import LessonRunner from '@/components/LessonRunner';

export default function CookQuestApp() {
  const [status, setStatus] = useState('');
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [profileRefresh, setProfileRefresh] = useState(0);

  return (
    <>
      <p className="tagline">
        Bite-sized cooking lessons. Sign in to track your score and streaks.
      </p>

      <Show when="signed-out">
        <section>
          <h2>Sign in to start cooking</h2>
          <p className="muted">Use Sign in or Sign up in the header to get started.</p>
        </section>
      </Show>

      <Show when="signed-in">
        <section>
          <ProfileCard onStatus={setStatus} refreshKey={profileRefresh} />

          {activeLessonId ? (
            <LessonRunner
              lessonId={activeLessonId}
              onStatus={setStatus}
              onSubmitted={() => setProfileRefresh((n) => n + 1)}
              onClose={() => setActiveLessonId(null)}
            />
          ) : (
            <>
              <h2>Lessons</h2>
              <LessonGrid
                onSelectLesson={setActiveLessonId}
                refreshKey={profileRefresh}
              />
            </>
          )}
        </section>
      </Show>

      <div className="status" role="status">
        {status}
      </div>
    </>
  );
}
