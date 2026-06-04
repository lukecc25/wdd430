export function gradeAttempt(lesson, answers = []) {
  let score = 0;
  let totalPossible = 0;
  const feedback = lesson.questions.map((q, i) => {
    const a = answers[i];
    const correct = a === q.correctIndex;
    totalPossible += q.points ?? 10;
    if (correct) score += q.points ?? 10;
    return {
      questionId: q.id ?? String(i),
      correct,
      points: correct ? (q.points ?? 10) : 0,
      explanation:
        q.explanation || (correct ? 'Nice — correct!' : 'Not quite. Review and try again.'),
    };
  });
  return { score, totalPossible, feedback };
}
