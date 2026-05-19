import { NextResponse } from 'next/server';
import { getLessonForQuiz } from '@/lib/lessonData';
import { ApiHttpError, handleApiError } from '@/lib/apiErrors';

export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  try {
    const { lessonId } = await params;
    const lesson = await getLessonForQuiz(lessonId);
    if (!lesson) {
      throw new ApiHttpError(404, 'not_found', 'Lesson not found');
    }

    return NextResponse.json(lesson);
  } catch (err) {
    return handleApiError(err);
  }
}
