import { StageInput } from '@pathwise/types';
import { getStageProgress, getRedTaskCount, isStageBehind } from './stage';
import { getRoadmapProgress } from './roadmap';

export function daysInProgram(startDate: Date, now: Date): number {
  return Math.max(
    0,
    Math.floor((now.getTime() - startDate.getTime()) / 86_400_000),
  );
}

export interface ProgramSnapshot {
  daysInProgram: number | null;
  progress: { completed: number; total: number };
  totalRedTasks: number;
  behindStageCount: number;
}

export function getProgramSnapshot(
  startDate: Date | null,
  stages: StageInput[],
  now: Date = new Date(),
): ProgramSnapshot {
  const stageProgresses = stages.map((s) => ({
    progress: getStageProgress(s),
  }));
  const progress = getRoadmapProgress(stageProgresses);
  const totalRedTasks = stages.reduce(
    (sum, s) => sum + getRedTaskCount(s, now),
    0,
  );
  const behindStageCount = stages.filter((s) =>
    isStageBehind(s, stages, now),
  ).length;

  return {
    daysInProgram: startDate ? daysInProgram(startDate, now) : null,
    progress,
    totalRedTasks,
    behindStageCount,
  };
}
