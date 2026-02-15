import { TaskVM } from '@/lib/types';
import { TaskRow } from './TaskRow';

export function StageDetailList({
  tasks,
  onSelectTask,
  emptyMessage = 'No tasks in this stage.',
}: {
  tasks: TaskVM[];
  onSelectTask: (task: TaskVM) => void;
  emptyMessage?: string;
}) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed border-edge bg-surface-elevated">
        <p className="text-sm text-content-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} onSelectTask={onSelectTask} />
      ))}
    </div>
  );
}
