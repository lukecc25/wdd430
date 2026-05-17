import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lesson from '@/lib/models/Lesson';
import { handleApiError } from '@/lib/apiErrors';

export async function GET() {
  try {
    await connectDB();
    const lessons = await Lesson.find({}, 'title description difficulty slug').lean();
    return NextResponse.json(lessons);
  } catch (err) {
    return handleApiError(err);
  }
}
