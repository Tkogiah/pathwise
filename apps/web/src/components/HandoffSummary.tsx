'use client';

import { useState } from 'react';
import { apiPatch } from '@/lib/api';

export function HandoffSummary({
  stageId,
  summary,
  onUpdated,
}: {
  stageId: string;
  summary: string | null;
  onUpdated: () => Promise<void>;
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
        <label className="text-xs font-medium text-gray-500">
          Handoff Summary
        </label>
        <textarea
          aria-label="Handoff summary"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          maxLength={2000}
          rows={3}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none"
          placeholder="Write a handoff summary for this stage..."
        />
        <div className="flex gap-2">
          <button
            aria-label="Save handoff summary"
            onClick={() => void handleSave()}
            disabled={saving}
            className="rounded bg-gray-900 px-3 py-1 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            aria-label="Cancel editing"
            onClick={handleCancel}
            disabled={saving}
            className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
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
        <span className="text-xs font-medium text-gray-500">
          Handoff Summary
        </span>
        <button
          onClick={handleEdit}
          className="text-xs text-gray-400 hover:text-gray-600"
        >
          Edit
        </button>
      </div>
      <p className="mt-1 text-sm text-gray-600">
        {summary || (
          <span className="italic text-gray-400">No handoff summary</span>
        )}
      </p>
    </div>
  );
}
