import { createError } from 'h3';

export class ApiHttpError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function handleApiError(err) {
  if (err instanceof ApiHttpError) {
    throw createError({
      statusCode: err.status,
      statusMessage: err.message,
      data: { error: err.code, message: err.message },
    });
  }

  console.error(err?.stack || err);
  throw createError({
    statusCode: 500,
    statusMessage: err?.message || 'Internal error',
    data: { error: 'internal_error', message: err?.message || String(err) },
  });
}
