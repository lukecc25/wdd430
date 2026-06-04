import { gqlError } from './errors.js';

export function validateCreateLessonInput(input) {
  const title = String(input?.title || '').trim();
  if (!title) gqlError('Title is required');

  const visibility = input?.visibility === 'private' ? 'private' : 'public';
  const difficulty = ['beginner', 'intermediate', 'advanced'].includes(input?.difficulty)
    ? input.difficulty
    : 'beginner';
  const description = String(input?.description || '').trim();
  const lessonContent = String(input?.lessonContent || '').trim();

  const rawQuestions = Array.isArray(input?.questions) ? input.questions : [];
  if (rawQuestions.length === 0) gqlError('Add at least one question');

  const questions = rawQuestions.map((q, index) => {
    const prompt = String(q?.prompt || '').trim();
    if (!prompt) gqlError(`Question ${index + 1} needs a prompt`);

    const options = (Array.isArray(q?.options) ? q.options : [])
      .map((opt) => String(opt || '').trim())
      .filter(Boolean);

    if (options.length < 2) {
      gqlError(`Question ${index + 1} needs at least two answer options`);
    }

    const correctIndex = Number(q?.correctIndex);
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      gqlError(`Question ${index + 1} needs a valid correct answer`);
    }

    return {
      prompt,
      options,
      correctIndex,
      points: Math.max(5, Number(q?.points) || 10),
      explanation: String(q?.explanation || '').trim(),
    };
  });

  return { title, description, lessonContent, difficulty, visibility, questions };
}
