'use client';

import { useState, useEffect, useId, useRef } from 'react';
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

function formatDateTime(dateString: string | null) {
  if (!dateString) return '\u2014';
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function toDateInputValue(dateString: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toDateTimeInputValue(dateString: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
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
  const [editingDue, setEditingDue] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(false);
  const [dueDateValue, setDueDateValue] = useState('');
  const [appointmentNoteValue, setAppointmentNoteValue] = useState('');
  const [appointmentError, setAppointmentError] = useState('');
  const appointmentInputRef = useRef<HTMLInputElement | null>(null);

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

  useEffect(() => {
    if (!task) return;
    setEditingDue(false);
    setEditingAppointment(false);
    setDueDateValue(toDateInputValue(task.dueDate));
    if (appointmentInputRef.current) {
      appointmentInputRef.current.value = toDateTimeInputValue(
        task.appointmentAt,
      );
    }
    setAppointmentNoteValue(task.appointmentNote ?? '');
    setAppointmentError('');
  }, [task]);

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

  const handleSaveDue = async () => {
    setUpdating(true);
    try {
      const dueDateIso = dueDateValue
        ? new Date(`${dueDateValue}T00:00:00`).toISOString()
        : null;
      await apiPatch(`/task-instances/${task.id}`, {
        dueDate: dueDateIso,
      });
      await onTaskUpdated();
      setEditingDue(false);
    } catch {
      // TODO: show error toast in future
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveAppointment = async () => {
    const rawAppointment = appointmentInputRef.current?.value ?? '';
    if (!rawAppointment) {
      setAppointmentError('Please choose a date and time for the appointment.');
      appointmentInputRef.current?.focus();
      return;
    }
    setUpdating(true);
    try {
      const appointmentIso = new Date(rawAppointment).toISOString();

      await apiPatch(`/task-instances/${task.id}`, {
        appointmentAt: appointmentIso,
        appointmentNote: appointmentNoteValue.trim()
          ? appointmentNoteValue.trim()
          : null,
      });
      await onTaskUpdated();
      setEditingAppointment(false);
      setAppointmentError('');
    } catch {
      // TODO: show error toast in future
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelDue = () => {
    setEditingDue(false);
    setDueDateValue(toDateInputValue(task.dueDate));
  };

  const handleCancelAppointment = () => {
    setEditingAppointment(false);
    if (appointmentInputRef.current) {
      appointmentInputRef.current.value = toDateTimeInputValue(
        task.appointmentAt,
      );
    }
    setAppointmentNoteValue(task.appointmentNote ?? '');
    setAppointmentError('');
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
                <div className="flex items-center justify-between">
                  <dt className="font-medium text-content-muted">Due Date</dt>
                  {!readOnly && !task.isLocked && (
                    <button
                      type="button"
                      onClick={() => setEditingDue((prev) => !prev)}
                      className="text-sm text-content-muted hover:text-content-secondary"
                      disabled={updating}
                    >
                      {editingDue ? 'Close' : 'Edit'}
                    </button>
                  )}
                </div>
                {!editingDue && (
                  <dd className="mt-1 text-content-primary">
                    {formatDate(task.dueDate)}
                  </dd>
                )}
                {editingDue && (
                  <div className="mt-2 space-y-2">
                    <input
                      type="date"
                      value={dueDateValue}
                      onChange={(event) => setDueDateValue(event.target.value)}
                      className="w-full rounded border border-edge bg-surface-elevated px-2 py-1 text-base text-content-primary"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void handleSaveDue()}
                        className="rounded bg-accent px-3 py-1.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
                        disabled={updating}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelDue}
                        className="rounded border border-edge px-3 py-1.5 text-sm text-content-secondary hover:bg-surface-card disabled:opacity-50"
                        disabled={updating}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 border-t border-edge pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-content-primary">
                  Appointment
                </h3>
                {!readOnly && !task.isLocked && (
                  <button
                    type="button"
                    onClick={() => setEditingAppointment((prev) => !prev)}
                    className="text-sm text-content-muted hover:text-content-secondary"
                    disabled={updating}
                  >
                    {editingAppointment ? 'Close' : 'Edit'}
                  </button>
                )}
              </div>

              {!editingAppointment && (
                <div className="text-base">
                  <dd className="mt-1 text-content-primary">
                    {formatDateTime(task.appointmentAt)}
                  </dd>
                  {task.appointmentNote && (
                    <dd className="mt-1 text-sm text-content-secondary">
                      {task.appointmentNote}
                    </dd>
                  )}
                </div>
              )}

              {editingAppointment && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-content-muted">
                      Appointment
                    </label>
                    <input
                      type="datetime-local"
                      ref={appointmentInputRef}
                      required
                      defaultValue={toDateTimeInputValue(task.appointmentAt)}
                      onChange={() => setAppointmentError('')}
                      className="mt-1 w-full rounded border border-edge bg-surface-elevated px-2 py-1 text-base text-content-primary"
                    />
                    {appointmentError && (
                      <p className="mt-2 text-sm text-status-error">
                        {appointmentError}
                      </p>
                    )}
                    <textarea
                      value={appointmentNoteValue}
                      onChange={(event) =>
                        setAppointmentNoteValue(event.target.value)
                      }
                      placeholder="Add appointment notes (optional)"
                      rows={2}
                      className="mt-2 w-full rounded border border-edge bg-surface-elevated px-2 py-1 text-sm text-content-primary"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void handleSaveAppointment()}
                      className="rounded bg-accent px-3 py-1.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-50"
                      disabled={updating}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelAppointment}
                      className="rounded border border-edge px-3 py-1.5 text-sm text-content-secondary hover:bg-surface-card disabled:opacity-50"
                      disabled={updating}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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
