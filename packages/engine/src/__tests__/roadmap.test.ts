import { describe, it, expect } from 'vitest';
import { getRoadmapProgress } from '../roadmap';

//empty stage
describe('getRoadmapProgress', () => {
  it('returns 0/0 when there are no stages', () => {
    const stages: Array<{ progress: { completed: number; total: number } }> =
      [];

    const result = getRoadmapProgress(stages);

    expect(result).toEqual({ completed: 0, total: 0 });
  });
});

//single stage
describe('getRoadmapProgress', () => {
  it('returns 0/1 when there is 1 stage', () => {
    const stages = [{ progress: { completed: 0, total: 1 } }];

    const result = getRoadmapProgress(stages);

    expect(result).toEqual({ completed: 0, total: 1 });
  });
});

//multiple stages
describe('getRoadmapProgress', () => {
  it('returns summed progress across multiple stages', () => {
    const stages = [
      { progress: { completed: 0, total: 2 } },
      { progress: { completed: 1, total: 5 } },
    ];

    const result = getRoadmapProgress(stages);

    expect(result).toEqual({ completed: 1, total: 7 });
  });
});
