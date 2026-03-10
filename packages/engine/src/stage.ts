import { StageInput, StageStatus, TaskStatus } from '@pathwise/types';
import { isTaskOverdue } from './task';

export function getStageStatus(
  stage: StageInput,
  now: Date = new Date(),
): StageStatus {
  if (stage.activatedAt === null) return StageStatus.GRAY;

  const requiredTasks = stage.tasks.filter((t) => t.isRequired);

  // No required tasks — stage is green by default
  if (requiredTasks.length === 0) return StageStatus.GREEN;

  const allRequiredDone = requiredTasks.every(
    (t) => t.status === TaskStatus.COMPLETE || t.isNa,
  );
  if (allRequiredDone) return StageStatus.GREEN;

  const anyRequiredRedFlag = requiredTasks.some(
    (t) => t.status === TaskStatus.BLOCKED || isTaskOverdue(t, now),
  );
  if (anyRequiredRedFlag) return StageStatus.RED;

  return StageStatus.YELLOW;
}

export function shouldActivateStage(
  stage: StageInput,
  previousStage: StageInput | null,
): boolean {
  // First stage is always active
  if (previousStage === null) return true;

  // Activate when previous stage has any activity
  return previousStage.tasks.some(
    (t) => t.status !== TaskStatus.NOT_STARTED || t.isNa,
  );
}

export function getStageProgress(stage: StageInput): {
  completed: number;
  total: number;
} {
  const requiredTasks = stage.tasks.filter((t) => t.isRequired);
  const completed = requiredTasks.filter(
    (t) => t.status === TaskStatus.COMPLETE || t.isNa,
  ).length;
  return { completed, total: requiredTasks.length };
}

export function getRedTaskCount(
  stage: StageInput,
  now: Date = new Date(),
): number {
  return stage.tasks.filter(
    (t) => isTaskOverdue(t, now) || t.status === TaskStatus.BLOCKED,
  ).length;
}

export function isStageBehind(
  stage: StageInput,
  allStages: StageInput[],
  now: Date = new Date(),
): boolean {
  if (stage.activatedAt === null) return false;
  if (getStageStatus(stage, now) === StageStatus.GREEN) return false;
  return allStages.some(
    (s) => s.orderIndex > stage.orderIndex && s.activatedAt !== null,
  );
}
