import { NextResponse } from 'next/server';
import { requireAuthUser } from '@/lib/auth';
import { getProgressByUserId } from '@/lib/lessonData';
import { handleApiError } from '@/lib/apiErrors';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await requireAuthUser();
    const progress = await getProgressByUserId(user._id);
    return NextResponse.json({ progress });
  } catch (err) {
    return handleApiError(err);
  }
}
