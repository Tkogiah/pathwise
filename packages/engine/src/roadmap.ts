import { StageProgressInput } from '@pathwise/types';
export function getRoadmapProgress(stages: StageProgressInput[]) {
  const completed = stages.reduce((sum, s) => sum + s.progress.completed, 0);
  const total = stages.reduce((sum, s) => sum + s.progress.total, 0);

  return { completed, total };
}
