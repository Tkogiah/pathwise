'use client';

import { useState, useEffect, useCallback } from 'react';
import { TaskNoteVM, NoteLabel } from '@/lib/types';
import { apiFetch, apiPost, apiPatch } from '@/lib/api';
import {
  NOTE_LABELS,
  ALL_LABELS,
  getLabelIcon,
  getAuthorName,
  timeAgo,
} from '@/lib/note-utils';

const SUMMARY_THRESHOLD = 200;

function NoteComposer({
  taskId,
  currentUserId,
  onCreated,
  onCancel,
}: {
  taskId: string;
  currentUserId: string;
  onCreated: (note: TaskNoteVM) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState<NoteLabel>('OTHER');
  const [body, setBody] = useState('');
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [saving, setSaving] = useState(false);

  const summaryVisible = showSummary || body.length >= SUMMARY_THRESHOLD;

  const handleSave = async () => {
    if (!body.trim()) return;
    setSaving(true);
    try {
      const note = await apiPost<TaskNoteVM>(
        `/task-instances/${taskId}/notes`,
        {
          authorId: currentUserId,
          label,
          body: body.trim(),
          ...(summaryVisible && summary.trim()
            ? { summary: summary.trim() }
            : {}),
        },
      );
      onCreated(note);
    } catch {
      // TODO: error toast
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 rounded-md border border-edge bg-surface-card px-3 py-3">
      <div className="flex items-center gap-2">
        <select
          value={label}
          onChange={(e) => setLabel(e.target.value as NoteLabel)}
          className="rounded border border-edge bg-surface-elevated px-2 py-1 text-sm text-content-primary"
        >
          {ALL_LABELS.map((l) => (
            <option key={l} value={l}>
              {NOTE_LABELS[l]}
            </option>
          ))}
        </select>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a note..."
        rows={3}
        className="w-full rounded border border-edge bg-surface-elevated px-2 py-1 text-sm text-content-primary"
      />
      {summaryVisible && (
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief summary (optional)"
          maxLength={200}
          className="w-full rounded border border-edge bg-surface-elevated px-2 py-1 text-sm text-content-primary"
        />
      )}
      {!summaryVisible && (
        <button
          type="button"
          onClick={() => setShowSummary(true)}
          className="text-xs text-content-muted hover:text-content-secondary"
        >
          + Add summary
        </button>
      )}
      <p className="text-xs text-content-muted">
        Avoid entering PHI/SSN/ID numbers.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={saving || !body.trim()}
          onClick={() => void handleSave()}
          className="rounded bg-accent px-3 py-1 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={onCancel}
          className="rounded border border-edge px-3 py-1 text-sm text-content-secondary hover:bg-surface-elevated disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function NoteEditor({
  note,
  currentUserId,
  onUpdated,
  onCancel,
}: {
  note: TaskNoteVM;
  currentUserId: string;
  onUpdated: (updated: TaskNoteVM) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState<NoteLabel>(note.label);
  const [body, setBody] = useState(note.body);
  const [summary, setSummary] = useState(note.summary ?? '');
  const [showSummary, setShowSummary] = useState(!!note.summary);
  const [saving, setSaving] = useState(false);

  const summaryVisible = showSummary || body.length >= SUMMARY_THRESHOLD;

  const handleSave = async () => {
    if (!body.trim()) return;
    setSaving(true);
    try {
      const updated = await apiPatch<TaskNoteVM>(`/notes/${note.id}`, {
        authorId: currentUserId,
        label,
        body: body.trim(),
        summary: summaryVisible && summary.trim() ? summary.trim() : null,
      });
      onUpdated(updated);
    } catch {
      // TODO: error toast
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-2 rounded-md border border-edge bg-surface-card px-3 py-2">
      <select
        value={label}
        onChange={(e) => setLabel(e.target.value as NoteLabel)}
        className="rounded border border-edge bg-surface-elevated px-2 py-1 text-sm text-content-primary"
      >
        {ALL_LABELS.map((l) => (
          <option key={l} value={l}>
            {NOTE_LABELS[l]}
          </option>
        ))}
      </select>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={3}
        className="w-full rounded border border-edge bg-surface-elevated px-2 py-1 text-sm text-content-primary"
      />
      {summaryVisible && (
        <input
          type="text"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Brief summary (optional)"
          maxLength={200}
          className="w-full rounded border border-edge bg-surface-elevated px-2 py-1 text-sm text-content-primary"
        />
      )}
      {!summaryVisible && (
        <button
          type="button"
          onClick={() => setShowSummary(true)}
          className="text-xs text-content-muted hover:text-content-secondary"
        >
          + Add summary
        </button>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          disabled={saving || !body.trim()}
          onClick={() => void handleSave()}
          className="rounded bg-accent px-3 py-1 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={onCancel}
          className="rounded border border-edge px-3 py-1 text-sm text-content-secondary hover:bg-surface-elevated disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function NoteCard({
  note,
  currentUserId,
  readOnly,
  onEdit,
}: {
  note: TaskNoteVM;
  currentUserId: string | null;
  readOnly: boolean;
  onEdit: () => void;
}) {
  const icon = getLabelIcon(note.label);
  const canEdit =
    !readOnly &&
    currentUserId != null &&
    note.authorId === currentUserId;

  return (
    <div className="space-y-1 rounded-md border border-edge px-3 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-surface-card px-2 py-0.5 text-xs font-medium text-content-secondary">
            {icon && <span className="mr-1">{icon}</span>}
            {NOTE_LABELS[note.label]}
          </span>
          <span className="text-xs text-content-muted">
            {getAuthorName(note.authorId, note.authorName)} ·{' '}
            {timeAgo(note.createdAt)}
          </span>
        </div>
        {canEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs text-content-muted hover:text-content-secondary"
          >
            Edit
          </button>
        )}
      </div>
      {note.summary && (
        <p className="text-sm font-medium text-content-primary">
          {note.summary}
        </p>
      )}
      <p className="text-sm text-content-secondary">{note.body}</p>
    </div>
  );
}

export function TaskNotes({
  taskId,
  currentUserId,
  readOnly,
}: {
  taskId: string;
  currentUserId: string | null;
  readOnly: boolean;
}) {
  const [notes, setNotes] = useState<TaskNoteVM[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [composerOpen, setComposerOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<TaskNoteVM[]>(
        `/task-instances/${taskId}/notes`,
      );
      setNotes(data);
    } catch {
      // TODO: error toast
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => {
    void fetchNotes();
  }, [fetchNotes]);

  const handleCreated = (note: TaskNoteVM) => {
    setNotes((prev) => [note, ...prev]);
    setComposerOpen(false);
  };

  const handleUpdated = (updated: TaskNoteVM) => {
    setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-3 border-t border-edge pt-4">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="text-base font-semibold text-content-primary"
        >
          Notes{' '}
          {!loading && (
            <span className="text-sm font-normal text-content-muted">
              ({notes.length})
            </span>
          )}
          <span className="ml-1 text-xs text-content-muted">
            {expanded ? '\u25B2' : '\u25BC'}
          </span>
        </button>
        {expanded && !readOnly && (
          <>
            {currentUserId ? (
              <button
                type="button"
                onClick={() => {
                  setComposerOpen(true);
                  setEditingNoteId(null);
                }}
                className="text-sm text-accent hover:underline"
                disabled={composerOpen}
              >
                + Add Note
              </button>
            ) : (
              <span className="text-xs text-content-muted">
                Log in to add notes
              </span>
            )}
          </>
        )}
      </div>

      {expanded && (
        <div className="space-y-3">
          {composerOpen && currentUserId && (
            <NoteComposer
              taskId={taskId}
              currentUserId={currentUserId}
              onCreated={handleCreated}
              onCancel={() => setComposerOpen(false)}
            />
          )}

          {loading && (
            <p className="text-sm text-content-muted">Loading notes...</p>
          )}

          {!loading && notes.length === 0 && !composerOpen && (
            <p className="text-sm text-content-muted">No notes yet.</p>
          )}

          {notes.map((note) =>
            editingNoteId === note.id && currentUserId ? (
              <NoteEditor
                key={note.id}
                note={note}
                currentUserId={currentUserId}
                onUpdated={handleUpdated}
                onCancel={() => setEditingNoteId(null)}
              />
            ) : (
              <NoteCard
                key={note.id}
                note={note}
                currentUserId={currentUserId}
                readOnly={readOnly}
                onEdit={() => {
                  setEditingNoteId(note.id);
                  setComposerOpen(false);
                }}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
