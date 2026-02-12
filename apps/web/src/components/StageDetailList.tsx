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
      <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed border-gray-200 bg-white">
        <p className="text-sm text-gray-500">{emptyMessage}</p>
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
