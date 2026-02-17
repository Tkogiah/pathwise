'use client';

import { useState } from 'react';
import { apiPatch } from '@/lib/api';

export function OverviewSummary({
  roadmapId,
  summary,
  readOnly,
  onUpdated,
}: {
  roadmapId: string;
  summary: string | null;
  readOnly: boolean;
  onUpdated: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(summary ?? '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPatch(`/roadmaps/${roadmapId}`, {
        overviewSummary: value.trim() ? value.trim() : null,
      });
      await onUpdated();
      setEditing(false);
    } catch {
      // TODO: error toast
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setValue(summary ?? '');
    setEditing(false);
  };

  if (readOnly) {
    return (
      <p className="text-sm text-content-secondary">
        {summary || 'No current focus set.'}
      </p>
    );
  }

  if (!editing) {
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm text-content-secondary">
          {summary || 'No current focus set.'}
        </p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-content-muted hover:text-content-secondary"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={2}
        className="w-full rounded border border-edge bg-surface-elevated px-2 py-1 text-sm text-content-primary"
        placeholder="Current focus (e.g., working on ID replacement)"
        maxLength={300}
      />
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="rounded bg-accent px-3 py-1 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={saving}
          className="rounded border border-edge px-3 py-1 text-sm text-content-secondary hover:bg-surface-card disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
