'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useAuthedFetch } from '@/lib/useAuthedFetch';

const PER_PAGE = 3;

export default function LessonGrid({ onSelectLesson, refreshKey = 0 }) {
  const { isLoaded, isSignedIn } = useAuth();
  const authedFetch = useAuthedFetch();
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({});
  const [page, setPage] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await fetch('/api/lessons');
      const data = await res.json();
      if (!cancelled) setLessons(data);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      setProgress({});
      return;
    }

    let cancelled = false;

    (async () => {
      const res = await authedFetch('/api/lessons/progress');
      if (!res.ok) return;
      const data = await res.json();
      if (!cancelled) setProgress(data.progress || {});
    })();

    return () => {
      cancelled = true;
    };
  }, [authedFetch, isLoaded, isSignedIn, refreshKey]);

  const totalPages = Math.max(1, Math.ceil(lessons.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const visible = lessons.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);

  function goPrev() {
    setPage((p) => Math.max(0, p - 1));
  }

  function goNext() {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }

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
            onClick={goPrev}
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
            onClick={goNext}
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

