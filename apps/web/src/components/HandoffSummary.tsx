'use client';

import { useState } from 'react';
import { apiPatch } from '@/lib/api';

export function HandoffSummary({
  stageId,
  summary,
  onUpdated,
  readOnly = false,
}: {
  stageId: string;
  summary: string | null;
  onUpdated: () => Promise<void>;
  readOnly?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(summary ?? '');
  const [saving, setSaving] = useState(false);

  const handleEdit = () => {
    setDraft(summary ?? '');
    setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await apiPatch(`/stage-instances/${stageId}/handoff`, {
        handoffSummary: draft,
      });
      await onUpdated();
      setEditing(false);
    } catch {
      // TODO: show error toast in future
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div className="mt-3 space-y-2">
        <label className="text-xs font-medium text-content-muted">
          Handoff Summary
        </label>
        <textarea
          aria-label="Handoff summary"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
          rows={3}
          className="w-full rounded border border-edge px-3 py-2 text-sm text-content-primary placeholder:text-content-muted focus:border-accent focus:outline-none"
          placeholder="Write a handoff summary for this stage..."
        />
        <div className="flex gap-2">
          <button
            aria-label="Save handoff summary"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded bg-accent px-3 py-1 text-xs font-medium text-white hover:bg-accent-hover disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            aria-label="Cancel editing"
            onClick={handleCancel}
            disabled={saving}
            className="rounded border border-edge px-3 py-1 text-xs font-medium text-content-secondary hover:bg-surface-card disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-content-muted">
          Handoff Summary
        </span>
        {!readOnly && (
          <button
            onClick={handleEdit}
            className="text-xs text-content-muted hover:text-content-secondary"
          >
            Edit
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-content-secondary">
        {summary || (
          <span className="italic text-content-muted">No handoff summary</span>
        )}
      </p>
    </div>
  );
}
