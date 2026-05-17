import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Lesson from '@/lib/models/Lesson';
import Attempt from '@/lib/models/Attempt';
import User from '@/lib/models/User';
import { requireAuthUser } from '@/lib/auth';
import { gradeAttempt } from '@/lib/lessonService';
import { ApiHttpError, handleApiError } from '@/lib/apiErrors';

export async function POST(request, { params }) {
  try {
    await connectDB();
    const user = await requireAuthUser();
    const { lessonId } = await params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      throw new ApiHttpError(404, 'not_found', 'Lesson not found');
    }

    const body = await request.json().catch(() => ({}));
    const { answers = [] } = body || {};
    const result = gradeAttempt(lesson, answers);

    const attempt = await Attempt.create({
      userId: user._id,
      lessonId: lesson._id,
      answers,
      score: result.score,
      totalPossible: result.totalPossible,
      feedback: result.feedback,
    });

    await User.findByIdAndUpdate(user._id, {
      $inc: { totalScore: result.score },
      'streak.lastActivityDate': new Date(),
    });

    return NextResponse.json({
      attemptId: attempt._id,
      score: result.score,
      totalPossible: result.totalPossible,
      feedback: result.feedback,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
