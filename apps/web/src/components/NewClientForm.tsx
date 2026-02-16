'use client';

import { useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api';

interface ClientSummary {
  id: string;
  firstName: string;
  lastName: string;
}

export function NewClientForm() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setFirstName('');
    setLastName('');
    setOpen(false);
  };

  const canSubmit =
    firstName.trim().length > 0 && lastName.trim().length > 0 && !saving;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSubmit) return;
    setSaving(true);
    try {
      const client = await apiPost<ClientSummary>('/clients', {
        firstName,
        lastName,
      });
      router.push(`/clients/${client.id}`);
    } catch {
      // TODO: error toast
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded border border-edge px-3 py-1 text-xs font-medium text-content-secondary hover:bg-surface-card"
        >
          New Client
        </button>
      ) : (
        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="flex flex-wrap items-end gap-2"
        >
          <label className="flex flex-col text-xs text-content-muted">
            First name
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="mt-1 w-32 rounded border border-edge bg-surface-elevated px-2 py-1 text-sm text-content-primary"
            />
          </label>
          <label className="flex flex-col text-xs text-content-muted">
            Last name
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="mt-1 w-32 rounded border border-edge bg-surface-elevated px-2 py-1 text-sm text-content-primary"
            />
          </label>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {saving ? 'Creating...' : 'Create'}
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={saving}
            className="rounded border border-edge px-3 py-1 text-xs font-medium text-content-secondary hover:bg-surface-card disabled:opacity-50"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
