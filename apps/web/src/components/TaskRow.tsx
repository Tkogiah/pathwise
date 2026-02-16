import { TaskVM } from '@/lib/types';
import { slugify } from '@/lib/utils';

const statusStyles = {
  gray: 'bg-status-inactive',
  green: 'bg-status-success',
  yellow: 'bg-status-warning',
  red: 'bg-status-error',
};

function getTaskStatusLabel(task: TaskVM): string {
  if (task.isLocked) return 'Locked';
  if (task.isNa) return 'Not Applicable';
  if (task.status === 'BLOCKED') return 'Blocked';
  if (task.isOverdue) return 'Overdue';
  if (task.status === 'COMPLETE') return 'Complete';
  if (task.status === 'IN_PROGRESS') return 'In Progress';
  return 'Not Started';
}

export function TaskRow({
  task,
  onSelectTask,
}: {
  task: TaskVM;
  onSelectTask: (task: TaskVM) => void;
}) {
  const isMuted = task.isNa || task.isLocked;
  const statusLabel = getTaskStatusLabel(task);
  const slug = slugify(task.title);

  return (
    <button
      type="button"
      onClick={() => onSelectTask(task)}
      aria-label={`${task.title} — ${statusLabel}`}
      data-testid={`task-row-${slug}`}
      className={`
        flex w-full cursor-pointer items-center space-x-3 rounded-md border p-2 text-left
        hover:bg-surface-card
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
        ${task.isOverdue ? 'border-status-error-border bg-status-error-bg' : 'border-edge bg-surface-elevated'}
        ${isMuted ? 'text-content-muted' : 'text-content-primary'}
      `}
    >
      <div
        className={`h-3 w-3 shrink-0 rounded-full ${statusStyles[task.color]}`}
        aria-hidden="true"
      />
      <span className="sr-only" data-testid={`task-status-label-${slug}`}>
        {statusLabel}
      </span>

      <div className="flex-1 truncate">
        <p
          className={`truncate text-base font-medium ${isMuted ? '' : 'text-content-primary'}`}
        >
          {task.title}
        </p>
      </div>

      {task.status === 'BLOCKED' && (
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-status-error text-[11px] font-bold text-white"
          title="Blocked"
          aria-label="Blocked"
        >
          !
        </span>
      )}

      {task.isLocked && (
        <span
          className="shrink-0 text-base text-content-muted"
          title="Locked"
          aria-label="Locked"
        >
          🔒
        </span>
      )}

      {task.isNa && (
        <span
          className="shrink-0 text-base text-content-muted"
          title="Not Applicable"
          aria-label="Not Applicable"
        >
          ✓
        </span>
      )}

      <div className="hidden shrink-0 items-center gap-4 text-sm text-content-muted sm:flex">
        {task.appointmentAt && (
          <span
            className="flex items-center gap-1 text-content-secondary"
            title={`Appointment: ${new Date(task.appointmentAt).toLocaleString(
              'en-US',
              {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              },
            )}`}
            aria-label="Appointment scheduled"
          >
            <span aria-hidden="true">📅</span>
            <span className="font-medium">Appt</span>
            {new Date(task.appointmentAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}
        <span>
          <span className="font-medium text-content-secondary">Due</span>{' '}
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })
            : '—'}
        </span>
      </div>

      <div className="h-6 w-6 shrink-0 rounded-full bg-surface-card text-center text-sm font-semibold leading-6 text-content-secondary">
        {task.assignedUser ? task.assignedUser.name.charAt(0) : '?'}
      </div>
    </button>
  );
}
