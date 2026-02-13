'use client';

import { useState, useEffect, useId } from 'react';
import { TaskVM } from '@/lib/types';
import { apiPatch } from '@/lib/api';

const STATUSES = ['NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'COMPLETE'] as const;

const STATUS_LABELS: Record<string, string> = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  BLOCKED: 'Blocked',
  COMPLETE: 'Complete',
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
}: {
  task: TaskVM | null;
  onClose: () => void;
  onTaskUpdated: () => Promise<void>;
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

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === task.status) return;
    setUpdating(true);
    try {
      await apiPatch(`/task-instances/${task.id}`, { status: newStatus });
      await onTaskUpdated();
    } catch {
      // TODO: show error toast in future
    } finally {
      setUpdating(false);
    }
  };

  const drawerStyles = `
    fixed z-20 bg-white shadow-lg transition-transform duration-300 ease-in-out
    w-full max-w-full md:max-w-md lg:max-w-lg
    bottom-0 md:top-0 md:right-0 md:bottom-auto
    h-4/5 md:h-full
    translate-y-0 md:translate-x-0
  `;

  return (
    <>
      <div
        className="fixed inset-0 z-10 bg-gray-900 bg-opacity-50"
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
              className="text-lg font-semibold text-gray-900"
              data-testid="task-drawer-title"
            >
              {task.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
              aria-label="Close panel"
            >
              &times;
            </button>
          </div>
          <div className="mt-6 space-y-6">
            {task.isLocked && (
              <div className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-500">
                This task is locked because a required dependency is not yet
                complete.
              </div>
            )}

            <p className="text-sm text-gray-600">
              {task.description || 'No description provided.'}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  {task.isLocked ? (
                    <span className="text-gray-400">
                      {STATUS_LABELS[task.status] ?? task.status}
                      <span className="ml-1 text-xs">(locked)</span>
                    </span>
                  ) : (
                    <select
                      value={task.status}
                      disabled={updating}
                      aria-label="Task status"
                      onChange={(e) => void handleStatusChange(e.target.value)}
                      className="rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 disabled:opacity-50"
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
                <dt className="font-medium text-gray-500">Due Date</dt>
                <dd className="mt-1 text-gray-900">
                  {formatDate(task.dueDate)}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="font-medium text-gray-500">Assignee</dt>
                <dd className="mt-1 text-gray-900">
                  {task.assignedUser?.name || 'Unassigned'}
                </dd>
              </div>
            </div>

            {task.status === 'BLOCKED' && (
              <div>
                <dt className="font-medium text-gray-500">Blocker</dt>
                <dd className="mt-1 text-gray-700">
                  {task.blockerType ? `${task.blockerType}: ` : ''}
                  {task.blockerNote || 'No details'}
                </dd>
              </div>
            )}

            {task.isNa && (
              <div>
                <dt className="font-medium text-gray-500">Not Applicable</dt>
                <dd className="mt-1 text-gray-700">
                  {task.naReason || 'No reason provided'}
                </dd>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
