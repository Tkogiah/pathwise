'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '@/lib/api';
import { ClientNoteEntry } from '@/lib/types';
import {
  NOTE_LABELS,
  getLabelIcon,
  getAuthorName,
  timeAgo,
} from '@/lib/note-utils';

type NotesFilter = '24h' | '7d';

function getStorageKey(userId: string | null) {
  return userId ? `pathwise-notes-rail:${userId}` : null;
}

function getSnippet(note: ClientNoteEntry) {
  if (note.summary) return note.summary;
  const trimmed = note.body.trim();
  return trimmed.length > 80 ? `${trimmed.slice(0, 80)}...` : trimmed;
}

export function NotesRail({
  clientId,
  currentUserId,
  onNavigateToTask,
}: {
  clientId: string;
  currentUserId: string | null;
  onNavigateToTask: (
    roadmapId: string,
    stageId: string,
    taskId: string,
  ) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<NotesFilter>('7d');
  const [notes, setNotes] = useState<ClientNoteEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const key = getStorageKey(currentUserId);
    if (key) {
      const stored = localStorage.getItem(key);
      if (stored === 'collapsed') {
        setCollapsed(true);
      }
    }
    setMounted(true);
  }, [currentUserId]);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    const key = getStorageKey(currentUserId);
    if (key) {
      localStorage.setItem(key, next ? 'collapsed' : 'expanded');
    }
  };

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch<ClientNoteEntry[]>(
        `/clients/${clientId}/notes?since=${filter}`,
      );
      setNotes(data);
    } catch {
      // TODO: error toast
    } finally {
      setLoading(false);
    }
  }, [clientId, filter]);

  useEffect(() => {
    if (!mounted) return;
    void fetchNotes();
  }, [fetchNotes, mounted]);

  if (!mounted) return null;

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={toggle}
        className="hidden h-fit cursor-pointer rounded-md border border-edge bg-surface-card px-2 py-4 text-sm font-medium text-content-muted hover:bg-surface-elevated hover:text-content-secondary md:block"
        style={{ writingMode: 'vertical-rl' }}
        aria-label="Expand notes panel"
      >
        Notes
      </button>
    );
  }

  return (
    <aside className="hidden rounded-lg border border-edge bg-surface-card md:block">
      <div className="flex items-center justify-between border-b border-edge px-3 py-2">
        <h3 className="text-sm font-semibold text-content-secondary">Notes</h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('24h')}
            className={`rounded px-2 py-1 text-xs ${
              filter === '24h'
                ? 'bg-surface-elevated text-content-primary'
                : 'text-content-muted hover:text-content-secondary'
            }`}
          >
            24h
          </button>
          <button
            type="button"
            onClick={() => setFilter('7d')}
            className={`rounded px-2 py-1 text-xs ${
              filter === '7d'
                ? 'bg-surface-elevated text-content-primary'
                : 'text-content-muted hover:text-content-secondary'
            }`}
          >
            7d
          </button>
          <button
            type="button"
            onClick={toggle}
            className="text-content-muted hover:text-content-secondary"
            aria-label="Collapse notes panel"
          >
            &times;
          </button>
        </div>
      </div>

      <div className="max-h-[520px] overflow-y-auto px-3 py-3">
        {loading && (
          <p className="text-sm text-content-muted">Loading notes...</p>
        )}
        {!loading && notes.length === 0 && (
          <p className="text-sm text-content-muted">
            {filter === '24h'
              ? 'No notes in the last 24 hours.'
              : 'No notes in the last 7 days.'}
          </p>
        )}
        <div className="space-y-3">
          {notes.map((note) => {
            const icon = getLabelIcon(note.label);
            return (
              <button
                key={note.id}
                type="button"
                onClick={() =>
                  onNavigateToTask(
                    note.roadmapId,
                    note.stageId,
                    note.taskInstanceId,
                  )
                }
                className="w-full rounded-md border border-edge px-3 py-2 text-left hover:bg-surface-elevated"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-xs font-medium text-content-secondary">
                    {icon && <span className="mr-1">{icon}</span>}
                    {NOTE_LABELS[note.label]}
                  </span>
                  <span className="text-xs text-content-muted">
                    {getAuthorName(note.authorId, note.authorName)} ·{' '}
                    {timeAgo(note.createdAt)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-content-primary">
                  {getSnippet(note)}
                </p>
                <p className="mt-1 text-xs text-content-muted">
                  {note.stageTitle} &gt; {note.taskTitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
