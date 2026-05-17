'use client';

import { useEffect, useState } from 'react';
import { useAuthedFetch } from '@/lib/useAuthedFetch';

export default function LessonRunner({ lessonId, onStatus, onSubmitted, onClose }) {
  const authedFetch = useAuthedFetch();
  const [lesson, setLesson] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!lessonId) {
      setLesson(null);
      setResult(null);
      return;
    }

    let cancelled = false;

    (async () => {
      const res = await fetch(`/api/lessons/${lessonId}`);
      if (!res.ok) {
        onStatus?.(`Could not load lesson (${res.status})`);
        return;
      }
      const data = await res.json();
      if (!cancelled) {
        setLesson(data);
        setAnswers({});
        setResult(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lessonId, onStatus]);

  if (!lessonId) return null;

  if (!lesson) {
    return (
      <div className="lesson-runner">
        <p className="muted">Loading lesson…</p>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const answerList = lesson.questions.map((_, qi) => {
      const val = answers[qi];
      return val === undefined ? -1 : Number(val);
    });

    const res = await authedFetch(`/api/lessons/${lessonId}/attempts`, {
      method: 'POST',
      body: JSON.stringify({ answers: answerList }),
    });

    if (!res.ok) {
      onStatus?.(`Submit failed (${res.status})`);
      return;
    }

    const data = await res.json();
    onStatus?.('');
    setResult(data);
    onSubmitted?.();
  }

  function handleBackToLessons() {
    setResult(null);
    onClose?.();
  }

  function handleRedoLesson() {
    setResult(null);
    setAnswers({});
    onStatus?.('');
  }

  if (result) {
    const perfect = result.score === result.totalPossible;
    const percent =
      result.totalPossible > 0
        ? Math.round((result.score / result.totalPossible) * 100)
        : 0;

    return (
      <div className="lesson-runner lesson-runner--complete">
        <h3>{lesson.title}</h3>

        <div className={`lesson-results ${perfect ? 'lesson-results--perfect' : ''}`}>
          {perfect ? (
            <>
              <p className="lesson-results__congrats">Congratulations, you got 100%!</p>
              <p className="lesson-results__points">
                You earned <strong>{result.score}</strong> points.
              </p>
            </>
          ) : (
            <>
              <p className="lesson-results__score">You scored {percent}%</p>
              <p className="lesson-results__points">
                You earned <strong>{result.score}</strong> of {result.totalPossible} points.
              </p>
            </>
          )}

          <ul className="feedback">
            {result.feedback.map((f, i) => (
              <li
                key={i}
                className={`feedback-item ${f.correct ? 'correct' : 'incorrect'}`}
              >
                Q{i + 1}: {f.correct ? '✓' : '✗'} (+{f.points}) — {f.explanation}
              </li>
            ))}
          </ul>

          <div className="lesson-results__actions">
            <button type="button" className="lesson-results__back" onClick={handleBackToLessons}>
              Back to lessons
            </button>
            <button type="button" className="lesson-results__redo" onClick={handleRedoLesson}>
              Redo lesson
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-runner">
      <button type="button" className="lesson-runner__back-link" onClick={handleBackToLessons}>
        ← Back to lessons
      </button>
      <h3>{lesson.title}</h3>
      <form onSubmit={handleSubmit}>
        {lesson.questions.map((q, qi) => (
          <fieldset key={q._id || qi} className="lesson-question-box">
            <h3 className="lesson-question">{q.prompt}</h3>
            {q.options.map((opt, oi) => (
              <label key={oi} htmlFor={`q${qi}_o${oi}`}>
                <input
                  type="radio"
                  name={`q${qi}`}
                  id={`q${qi}_o${oi}`}
                  value={oi}
                  required
                  checked={answers[qi] === oi}
                  onChange={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                />
                <span>{opt}</span>
              </label>
            ))}
          </fieldset>
        ))}
        <button type="submit">Submit answers</button>
      </form>
    </div>
  );
}
