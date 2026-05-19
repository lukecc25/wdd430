import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { requireAuthUser } from '@/lib/auth';
import { handleApiError } from '@/lib/apiErrors';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    const user = await requireAuthUser();

    return NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        totalScore: user.totalScore,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
