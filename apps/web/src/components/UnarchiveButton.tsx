'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiPatch } from '@/lib/api';

export function UnarchiveButton({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleUnarchive = async () => {
    setLoading(true);
    try {
      await apiPatch(`/clients/${clientId}/unarchive`, {});
      router.refresh();
    } catch {
      // TODO: error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={() => void handleUnarchive()}
      disabled={loading}
      className="rounded bg-accent px-3 py-1 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
    >
      {loading ? 'Restoring...' : 'Unarchive'}
    </button>
  );
}
