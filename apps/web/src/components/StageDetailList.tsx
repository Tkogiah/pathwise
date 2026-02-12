
import { TaskVM } from '@/lib/types';
import { TaskRow } from './TaskRow';

export function StageDetailList({ tasks }: { tasks: TaskVM[] }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed border-gray-200 bg-white">
        <p className="text-sm text-gray-500">No tasks in this stage.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </div>
  );
}
