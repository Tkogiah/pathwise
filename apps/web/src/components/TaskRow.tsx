import { TaskVM } from '@/lib/types';

const statusStyles = {
  gray: 'bg-gray-200',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  red: 'bg-red-500',
};

export function TaskRow({ task }: { task: TaskVM }) {
  const isMuted = task.isNa || task.isLocked;

  return (
    <div
      className={`
        flex items-center space-x-3 rounded-md border p-2
        ${task.isOverdue ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-white'}
        ${isMuted ? 'text-gray-400' : 'text-gray-800'}
      `}
    >
      <div className={`h-3 w-3 shrink-0 rounded-full ${statusStyles[task.color]}`} />
      
      <div className="flex-1 truncate">
        <p className={`truncate text-sm font-medium ${isMuted ? '' : 'text-gray-900'}`}>
          {task.title}
        </p>
      </div>

      {task.status === 'BLOCKED' && (
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
          title="Blocked"
        >
          !
        </span>
      )}

      {task.isLocked && (
        <span className="shrink-0 text-sm text-gray-400" title="Locked">
          🔒
        </span>
      )}

      {task.isNa && (
        <span className="shrink-0 text-sm text-gray-400" title="Not Applicable">
          ✓
        </span>
      )}

      <div className="hidden shrink-0 text-xs text-gray-500 sm:block">
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })
          : '—'}
      </div>

      <div className="h-6 w-6 shrink-0 rounded-full bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-600">
        {task.assignedUser ? task.assignedUser.name.charAt(0) : '?'}
      </div>
    </div>
  );
}
