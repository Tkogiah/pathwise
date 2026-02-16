'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPatch } from '@/lib/api';

export function ArchiveButton({
  clientId,
  isArchived,
}: {
  clientId: string;
  isArchived: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      const endpoint = isArchived ? 'unarchive' : 'archive';
      await apiPatch(`/clients/${clientId}/${endpoint}`, {});
      if (isArchived) {
        router.refresh();
      } else {
        router.push('/clients');
      }
    } catch {
      // TODO: error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleToggle()}
      disabled={loading}
      className="rounded border border-edge px-3 py-1 text-sm font-medium text-content-secondary hover:bg-surface-card disabled:opacity-50"
    >
      {loading
        ? isArchived
          ? 'Restoring...'
          : 'Archiving...'
        : isArchived
          ? 'Unarchive'
          : 'Archive'}
    </button>
  );
}
