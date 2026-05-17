import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Attempt from '@/lib/models/Attempt';
import { requireAuthUser } from '@/lib/auth';
import { handleApiError } from '@/lib/apiErrors';

export async function GET() {
  try {
    await connectDB();
    const user = await requireAuthUser();

    const recentAttempts = await Attempt.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('lessonId', 'title slug')
      .lean();

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        totalScore: user.totalScore,
        streak: user.streak,
      },
      recentAttempts,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
