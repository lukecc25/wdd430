'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useAuthedFetch } from '@/lib/useAuthedFetch';

const PER_PAGE = 3;

export default function LessonGrid({
  lessons = [],
  progress: initialProgress = {},
  onSelectLesson,
  refreshKey = 0,
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const authedFetch = useAuthedFetch();
  const [progress, setProgress] = useState(initialProgress);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setProgress(initialProgress);
  }, [initialProgress]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || refreshKey === 0) return;

    let cancelled = false;

    (async () => {
      const res = await authedFetch('/api/lessons/progress');
      if (!res.ok || cancelled) return;
      const data = await res.json();
      setProgress(data.progress || {});
    })();

    return () => {
      cancelled = true;
    };
  }, [authedFetch, isLoaded, isSignedIn, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(lessons.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const visible = lessons.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);

  return (
    <div className="lessons-carousel">
      <div className="lessons-grid">
        {visible.map((lesson) => {
          const attempt = progress[lesson._id];
          const completed = Boolean(attempt);

          return (
            <button
              key={lesson._id}
              type="button"
              className={`lesson-card lesson-card--${lesson.difficulty}${completed ? ' lesson-card--completed' : ''}`}
              onClick={() => onSelectLesson(lesson._id)}
            >
              {completed ? (
                <span className="lesson-card__completed">Completed</span>
              ) : null}
              <strong>{lesson.title}</strong>
              <span className="muted">{lesson.difficulty}</span>
              {completed ? (
                <span className="lesson-card__score">
                  Score: {attempt.score} / {attempt.totalPossible}
                </span>
              ) : null}
              <p>{lesson.description || ''}</p>
            </button>
          );
        })}
      </div>

      {lessons.length > PER_PAGE ? (
        <div className="lessons-carousel__controls">
          <button
            type="button"
            className="lessons-carousel__btn"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={safePage === 0}
            aria-label="Previous lessons"
          >
            ← Prev
          </button>
          <span className="lessons-carousel__indicator">
            {safePage + 1} / {totalPages}
          </span>
          <button
            type="button"
            className="lessons-carousel__btn"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={safePage >= totalPages - 1}
            aria-label="Next lessons"
          >
            Next →
          </button>
        </div>
      ) : null}
    </div>
  );
}
