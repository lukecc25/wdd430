import { NextResponse } from 'next/server';
import { getLessonsList } from '@/lib/lessonData';
import { handleApiError } from '@/lib/apiErrors';

export async function GET() {
  try {
    const lessons = await getLessonsList();
    return NextResponse.json(lessons);
  } catch (err) {
    return handleApiError(err);
  }
}
