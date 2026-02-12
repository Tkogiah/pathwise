
'use client';

import { useEffect, useId } from 'react';
import { TaskVM } from '@/lib/types';

function formatDate(dateString: string | null) {
  if (!dateString) return '—';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function TaskDrawer({
  task,
  onClose,
}: {
  task: TaskVM | null;
  onClose: () => void;
}) {
  const titleId = useId();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const drawerStyles = `
    fixed z-20 bg-white shadow-lg transition-transform duration-300 ease-in-out
    w-full max-w-full md:max-w-md
    bottom-0 md:top-0 md:right-0 md:bottom-auto
    h-4/5 md:h-full
  `;
  const transformStyle = task
    ? 'translate-y-0 md:translate-x-0'
    : 'translate-y-full md:translate-y-0 md:translate-x-full';

  return (
    <>
      {task && (
        <div
          className="fixed inset-0 z-10 bg-gray-900 bg-opacity-50"
          onClick={onClose}
        />
      )}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`${drawerStyles} ${transformStyle}`}
      >
        {task && (
          <div className="flex h-full flex-col overflow-y-auto p-6">
            <div className="flex items-start justify-between">
              <h2 id={titleId} className="text-lg font-semibold text-gray-900">
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
              <p className="text-sm text-gray-600">{task.description || 'No description provided.'}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-gray-900">{task.status}</dd>
                </div>
                <div>
                  <dt className="font-medium text-gray-500">Due Date</dt>
                  <dd className="mt-1 text-gray-900">{formatDate(task.dueDate)}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="font-medium text-gray-500">Assignee</dt>
                  <dd className="mt-1 text-gray-900">{task.assignedUser?.name || 'Unassigned'}</dd>
                </div>
              </div>

              {task.status === 'BLOCKED' && (
                <div>
                  <dt className="font-medium text-gray-500">Blocker</dt>
                  <dd className="mt-1 text-red-700">{task.blockerNote || 'No details'}</dd>
                </div>
              )}

              {task.isNa && (
                <div>
                  <dt className="font-medium text-gray-500">Not Applicable</dt>
                  <dd className="mt-1 text-gray-700">{task.naReason || 'No reason provided'}</dd>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

