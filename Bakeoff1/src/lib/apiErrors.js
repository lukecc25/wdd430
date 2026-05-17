import { NextResponse } from 'next/server';

export class ApiHttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function handleApiError(err) {
  if (err instanceof ApiHttpError) {
    return NextResponse.json({ error: err.code, message: err.message }, { status: err.status });
  }
  console.error(err?.stack || err);
  return NextResponse.json(
    { error: 'internal_error', message: err.message || String(err) },
    { status: 500 }
  );
}
