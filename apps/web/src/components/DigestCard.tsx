'use client';

import { useState, useEffect } from 'react';
import { apiFetchAuth } from '@/lib/api';
import { timeAgo } from '@/lib/note-utils';

interface Digest {
  id: string;
  dateKey: string;
  summary: string;
  createdAt: string;
}

export function DigestCard({ loggedIn }: { loggedIn: boolean }) {
  const [digest, setDigest] = useState<Digest | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;
    const dateKey = new Date().toISOString().slice(0, 10);
    apiFetchAuth<Digest[]>(`/digest/me?date=${dateKey}`)
      .then((results) => {
        setDigest(results[0] ?? null);
      })
      .catch(() => {
        // silently fail — digest is non-critical
      })
      .finally(() => setLoaded(true));
  }, [loggedIn]);

  if (!loggedIn || !loaded) return null;

  if (!digest) {
    return (
      <div className="border-b border-edge px-3 py-2">
        <p className="text-xs text-content-muted">No appointments today.</p>
      </div>
    );
  }

  const lines = digest.summary.split('\n');
  const header = lines[0];
  const items = lines.slice(1);

  return (
    <div className="border-b border-edge px-3 py-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold text-content-secondary">
          {header}
        </h4>
      </div>
      <div className="mt-1 space-y-0.5">
        {items.map((line, i) => (
          <p key={i} className="text-xs text-content-primary">
            {line}
          </p>
        ))}
      </div>
      <p className="mt-1 text-[10px] text-content-muted">
        Updated {timeAgo(digest.createdAt)}
      </p>
    </div>
  );
}
