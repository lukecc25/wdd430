'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useAuthedFetch } from '@/lib/useAuthedFetch';

export default function ProfileCard({ onError, refreshKey = 0 }) {
  const { isLoaded } = useAuth();
  const authedFetch = useAuthedFetch();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!isLoaded) return;

    let cancelled = false;

    (async () => {
      const res = await authedFetch('/api/users/me');
      if (!res.ok) {
        onError?.(`Profile load failed (${res.status})`);
        return;
      }
      const data = await res.json();
      if (!cancelled) setUser(data.user);
    })();

    return () => {
      cancelled = true;
    };
  }, [authedFetch, isLoaded, onError, refreshKey]);

  if (!user) {
    return (
      <div className="profile-card">
        <strong>Loading profile…</strong>
      </div>
    );
  }

  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

  return (
    <div className="profile-card">
      {user.imageUrl ? (
        <img src={user.imageUrl} alt="" width={44} height={44} />
      ) : null}
      <div>
        <strong>{displayName}</strong>
        <div className="muted">
          Total score: <span>{user.totalScore}</span>
        </div>
      </div>
    </div>
  );
}
