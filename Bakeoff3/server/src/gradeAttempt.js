export function gradeAttempt(lesson, answers = []) {
  let score = 0;
  let totalPossible = 0;
  const feedback = lesson.questions.map((q, i) => {
    const a = answers[i];
    const correct = a === q.correctIndex;
    const correctAnswer = q.options[q.correctIndex] ?? '';
    totalPossible += q.points ?? 10;
    if (correct) score += q.points ?? 10;

    const yourAnswer =
      Number.isInteger(a) && a >= 0 && a < q.options.length ? q.options[a] : null;

    let explanation = q.explanation?.trim() || '';
    if (!explanation) {
      explanation = correct ? 'Nice — correct!' : `The correct answer is "${correctAnswer}".`;
    }

    const item = {
      questionId: q.id ?? String(i),
      correct,
      points: correct ? (q.points ?? 10) : 0,
      explanation,
    };

    if (!correct) {
      item.correctAnswer = correctAnswer;
      if (yourAnswer) item.yourAnswer = yourAnswer;
    }

    return item;
  });
  return { score, totalPossible, feedback };
}
