import { ApiHttpError } from './apiErrors.js';

export function validateCreateLessonBody(body) {
  const title = String(body?.title || '').trim();
  if (!title) {
    throw new ApiHttpError(400, 'invalid_title', 'Title is required');
  }

  const visibility = body?.visibility === 'private' ? 'private' : 'public';
  const difficulty = ['beginner', 'intermediate', 'advanced'].includes(body?.difficulty)
    ? body.difficulty
    : 'beginner';
  const description = String(body?.description || '').trim();
  const lessonContent = String(body?.lessonContent || '').trim();

  const rawQuestions = Array.isArray(body?.questions) ? body.questions : [];
  if (rawQuestions.length === 0) {
    throw new ApiHttpError(400, 'invalid_questions', 'Add at least one question');
  }

  const questions = rawQuestions.map((q, index) => {
    const prompt = String(q?.prompt || '').trim();
    if (!prompt) {
      throw new ApiHttpError(400, 'invalid_question', `Question ${index + 1} needs a prompt`);
    }

    const options = (Array.isArray(q?.options) ? q.options : [])
      .map((opt) => String(opt || '').trim())
      .filter(Boolean);

    if (options.length < 2) {
      throw new ApiHttpError(
        400,
        'invalid_options',
        `Question ${index + 1} needs at least two answer options`
      );
    }

    const correctIndex = Number(q?.correctIndex);
    if (!Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex >= options.length) {
      throw new ApiHttpError(
        400,
        'invalid_correct_index',
        `Question ${index + 1} needs a valid correct answer`
      );
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
