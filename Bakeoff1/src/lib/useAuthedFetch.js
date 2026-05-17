'use client';

import { useAuth } from '@clerk/nextjs';
import { useCallback } from 'react';

export function useAuthedFetch() {
  const { getToken } = useAuth();

  return useCallback(
    async (url, options = {}) => {
      const token = await getToken();
      return fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    },
    [getToken]
  );
}
