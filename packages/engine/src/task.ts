import { TaskInput, TaskStatus } from '@pathwise/types';

export type TaskColor = 'green' | 'yellow' | 'red' | 'gray' | 'blue';

export function isTaskOverdue(
  task: TaskInput,
  now: Date = new Date(),
): boolean {
  return (
    task.status !== TaskStatus.COMPLETE &&
    !task.isNa &&
    task.dueDate !== null &&
    task.dueDate < now
  );
}

export function isTaskLocked(task: TaskInput, allTasks: TaskInput[]): boolean {
  if (task.dependsOnTaskId === null) return false;

  const dependency = allTasks.find((t) => t.id === task.dependsOnTaskId);
  if (!dependency) return false;

  // Dependency must be required and not complete (N/A counts as complete)
  if (!dependency.isRequired) return false;
  return dependency.status !== TaskStatus.COMPLETE && !dependency.isNa;
}

export function isTaskRed(task: TaskInput, now: Date = new Date()): boolean {
  return isTaskOverdue(task, now) || task.status === TaskStatus.BLOCKED;
}

export function getTaskColor(
  task: TaskInput,
  allTasks: TaskInput[],
  now: Date = new Date(),
): TaskColor {
  if (isTaskLocked(task, allTasks)) return 'gray';
  if (isTaskRed(task, now)) return 'red';
  if (task.isNa) return 'blue';
  if (task.status === TaskStatus.COMPLETE) return 'green';
  if (task.status === TaskStatus.IN_PROGRESS) return 'yellow';
  return 'gray';
}
