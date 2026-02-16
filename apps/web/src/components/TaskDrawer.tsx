'use client';

import { useState, useEffect, useId } from 'react';
import { TaskVM } from '@/lib/types';
import { apiPatch } from '@/lib/api';

const STATUSES = [
  'NOT_STARTED',
  'IN_PROGRESS',
  'BLOCKED',
  'COMPLETE',
  'NOT_APPLICABLE',
] as const;

const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
  COMPLETE: 'Complete',
  NOT_APPLICABLE: 'Not Applicable',
};

function formatDate(dateString: string | null) {
  if (!dateString) return '\u2014';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function TaskDrawer({
  task,
  onClose,
  onTaskUpdated,
  readOnly = false,
}: {
  task: TaskVM | null;
  onClose: () => void;
  onTaskUpdated: () => Promise<void>;
  readOnly?: boolean;
}) {
  const titleId = useId();
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!task) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [task, onClose]);

  if (!task) return null;

  const effectiveStatus = task.isNa ? 'NOT_APPLICABLE' : task.status;

  const handleStatusChange = async (newValue: string) => {
    if (newValue === effectiveStatus) return;
    setUpdating(true);
    try {
      if (newValue === 'NOT_APPLICABLE') {
        await apiPatch(`/task-instances/${task.id}`, { isNa: true });
      } else {
        await apiPatch(`/task-instances/${task.id}`, {
          status: newValue,
          isNa: false,
          naReason: null,
        });
      }
      await onTaskUpdated();
    } catch {
      // TODO: show error toast in future
    } finally {
      setUpdating(false);
    }
  };

  const drawerStyles = `
    fixed z-20 bg-surface-elevated shadow-lg transition-transform duration-300 ease-in-out
    w-full max-w-full md:max-w-md lg:max-w-lg
    bottom-0 md:top-0 md:right-0 md:bottom-auto
    h-4/5 md:h-full
    translate-y-0 md:translate-x-0
  `;

  return (
    <>
      <div
        className="fixed inset-0 z-10 bg-overlay/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={drawerStyles}
        data-testid="task-drawer"
      >
        <div className="flex h-full flex-col overflow-y-auto p-6">
          <div className="flex items-start justify-between">
            <h2
              id={titleId}
              className="text-lg font-semibold text-content-primary"
              data-testid="task-drawer-title"
            >
              {task.title}
            </h2>
            <button
              onClick={onClose}
              className="text-xl text-content-muted hover:text-content-secondary"
              aria-label="Close panel"
            >
              &times;
            </button>
          </div>
          <div className="mt-6 space-y-6">
            {task.isLocked && (
              <div className="rounded-md border border-status-inactive-border bg-status-inactive-bg px-3 py-2 text-sm text-content-muted">
                This task is locked because a required dependency is not yet
                complete.
              </div>
            )}

            <p className="text-base text-content-secondary">
              {task.description || 'No description provided.'}
            </p>

            <div className="grid grid-cols-2 gap-4 text-base">
              <div>
                <dt className="font-medium text-content-muted">Status</dt>
                <dd className="mt-1">
                  {task.isLocked || readOnly ? (
                    <span className="text-content-muted">
                      {STATUS_LABELS[effectiveStatus] ?? task.status}
                      {task.isLocked && (
                        <span className="ml-1 text-sm">(locked)</span>
                      )}
                    </span>
                  ) : (
                    <select
                      value={effectiveStatus}
                      disabled={updating}
                      aria-label="Task status"
                      onChange={(e) => void handleStatusChange(e.target.value)}
                      className="rounded border border-edge bg-surface-elevated px-2 py-1 text-base text-content-primary disabled:opacity-50"
                      data-testid="task-status-select"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </option>
                      ))}
                    </select>
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-content-muted">Due Date</dt>
                <dd className="mt-1 text-content-primary">
                  {formatDate(task.dueDate)}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="font-medium text-content-muted">Assignee</dt>
                <dd className="mt-1 text-content-primary">
                  {task.assignedUser?.name || 'Unassigned'}
                </dd>
              </div>
            </div>

            {task.status === 'BLOCKED' && (
              <div>
                <dt className="font-medium text-content-muted">Blocker</dt>
                <dd className="mt-1 text-content-secondary">
                  {task.blockerType ? `${task.blockerType}: ` : ''}
                  {task.blockerNote || 'No details'}
                </dd>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
