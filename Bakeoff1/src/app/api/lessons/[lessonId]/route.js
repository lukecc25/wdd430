import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lesson from '@/lib/models/Lesson';
import { ApiHttpError, handleApiError } from '@/lib/apiErrors';

export async function GET(_request, { params }) {
  try {
    await connectDB();
    const { lessonId } = await params;
    const lesson = await Lesson.findById(lessonId).lean();
    if (!lesson) {
      throw new ApiHttpError(404, 'not_found', 'Lesson not found');
    }

    lesson.questions = lesson.questions.map(({ correctIndex, explanation, ...rest }) => rest);
    return NextResponse.json(lesson);
  } catch (err) {
    return handleApiError(err);
  }
}
