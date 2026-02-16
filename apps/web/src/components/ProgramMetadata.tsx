'use client';

import { useState } from 'react';
import { apiPatch } from '@/lib/api';

function formatDisplayDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function toDateInputValue(dateString: string): string {
  return new Date(dateString).toISOString().split('T')[0];
}

export function ProgramMetadata({
  roadmapId,
  startDate,
  programLengthDays,
  readOnly,
  onUpdated,
}: {
  roadmapId: string;
  startDate: string;
  programLengthDays: number | null;
  readOnly: boolean;
  onUpdated: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [dateValue, setDateValue] = useState(() =>
    toDateInputValue(startDate),
  );
  const [lengthValue, setLengthValue] = useState(
    programLengthDays?.toString() ?? '',
  );
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    setDateValue(toDateInputValue(startDate));
    setLengthValue(programLengthDays?.toString() ?? '');
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Record<string, unknown> = {};
      const isoDate = new Date(dateValue + 'T00:00:00').toISOString();
      payload.startDate = isoDate;
      payload.programLengthDays = lengthValue
        ? parseInt(lengthValue, 10)
        : null;
      await apiPatch(`/roadmaps/${roadmapId}`, payload);
      await onUpdated();
      setEditing(false);
    } catch {
      // TODO: show error toast
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="flex flex-wrap items-end gap-3 rounded-md border border-edge bg-surface-elevated px-3 py-2">
        <div>
          <label className="block text-[10px] font-medium text-content-muted">
            Start Date
          </label>
          <input
            type="date"
            value={dateValue}
            onChange={(e) => setDateValue(e.target.value)}
            className="mt-0.5 rounded border border-edge bg-surface-primary px-2 py-1 text-sm text-content-primary"
          />
        </div>
        <div>
          <label className="block text-[10px] font-medium text-content-muted">
            Program Length (days)
          </label>
          <input
            type="number"
            min="1"
            value={lengthValue}
            onChange={(e) => setLengthValue(e.target.value)}
            className="mt-0.5 w-20 rounded border border-edge bg-surface-primary px-2 py-1 text-sm text-content-primary"
          />
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="rounded bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent/90 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleCancel}
            className="rounded border border-edge px-3 py-1 text-xs font-medium text-content-muted hover:text-content-secondary disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-xs text-content-muted">
      <span>Start: {formatDisplayDate(startDate)}</span>
      {programLengthDays != null && (
        <span>Length: {programLengthDays} days</span>
      )}
      {!readOnly && (
        <button
          type="button"
          onClick={handleEdit}
          className="text-accent hover:underline"
        >
          Edit
        </button>
      )}
    </div>
  );
}
