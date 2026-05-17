import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Attempt from '@/lib/models/Attempt';
import { requireAuthUser } from '@/lib/auth';
import { handleApiError } from '@/lib/apiErrors';

export async function GET() {
  try {
    await connectDB();
    const user = await requireAuthUser();

    const attempts = await Attempt.aggregate([
      { $match: { userId: user._id } },
      {
        $group: {
          _id: '$lessonId',
          score: { $max: '$score' },
          totalPossible: { $max: '$totalPossible' },
        },
      },
    ]);

    const progress = Object.fromEntries(
      attempts.map((a) => [
        a._id.toString(),
        { score: a.score, totalPossible: a.totalPossible },
      ])
    );

    return NextResponse.json({ progress });
  } catch (err) {
    return handleApiError(err);
  }
}
