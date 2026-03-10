import { describe, it, expect } from 'vitest';
import { daysInProgram, getProgramSnapshot } from '../program';
import { TaskStatus } from '@pathwise/types';
import type { StageInput } from '@pathwise/types';

describe('daysInProgram', () => {
  it('returns 0 on the same day', () => {
    const start = new Date('2025-06-15T10:00:00Z');
    const now = new Date('2025-06-15T14:00:00Z');
    expect(daysInProgram(start, now)).toBe(0);
  });

  it('returns 1 after exactly 24 hours', () => {
    const start = new Date('2025-06-15T10:00:00Z');
    const now = new Date('2025-06-16T10:00:00Z');
    expect(daysInProgram(start, now)).toBe(1);
  });

  it('floors fractional days', () => {
    // 23h59m elapsed — not yet a full day
    const start = new Date('2025-06-14T23:59:00Z');
    const now = new Date('2025-06-15T00:01:00Z');
    expect(daysInProgram(start, now)).toBe(0);
  });

  it('handles month boundary correctly', () => {
    const start = new Date('2025-01-28T00:00:00Z');
    const now = new Date('2025-02-04T00:00:00Z');
    expect(daysInProgram(start, now)).toBe(7);
  });

  it('clamps to 0 when startDate is in the future', () => {
    const start = new Date('2025-06-20T00:00:00Z');
    const now = new Date('2025-06-15T00:00:00Z');
    expect(daysInProgram(start, now)).toBe(0);
  });

  it('does not mutate input dates', () => {
    const start = new Date('2025-06-01T00:00:00Z');
    const now = new Date('2025-06-10T00:00:00Z');
    const startIso = start.toISOString();
    const nowIso = now.toISOString();
    daysInProgram(start, now);
    expect(start.toISOString()).toBe(startIso);
    expect(now.toISOString()).toBe(nowIso);
  });
});

// ---------------------------------------------------------------------------
// Helpers for getProgramSnapshot tests
// ---------------------------------------------------------------------------

const NOW = new Date('2025-06-10T12:00:00Z');
const START = new Date('2025-06-01T00:00:00Z'); // 9 days before NOW

function makeTask(
  id: string,
  status: TaskStatus,
  opts: { isRequired?: boolean; isNa?: boolean; dueDate?: Date | null } = {},
) {
  return {
    id,
    status,
    isRequired: opts.isRequired ?? true,
    isNa: opts.isNa ?? false,
    dueDate: opts.dueDate ?? null,
    dependsOnTaskId: null,
  };
}

function makeStage(
  id: string,
  orderIndex: number,
  activatedAt: Date | null,
  tasks: StageInput['tasks'],
): StageInput {
  return { id, orderIndex, activatedAt, tasks };
}

describe('getProgramSnapshot', () => {
  it('returns correct daysInProgram and zero red/behind when all complete', () => {
    const stages = [
      makeStage('s1', 0, new Date('2025-06-01T00:00:00Z'), [
        makeTask('t1', TaskStatus.COMPLETE),
        makeTask('t2', TaskStatus.COMPLETE),
      ]),
    ];

    const snap = getProgramSnapshot(START, stages, NOW);

    expect(snap.daysInProgram).toBe(9);
    expect(snap.progress).toEqual({ completed: 2, total: 2 });
    expect(snap.totalRedTasks).toBe(0);
    expect(snap.behindStageCount).toBe(0);
  });

  it('counts a behind stage when a non-green stage has a later activated stage', () => {
    const overdue = new Date('2025-06-01T00:00:00Z'); // before NOW → overdue
    const stages = [
      makeStage('s1', 0, new Date('2025-06-01T00:00:00Z'), [
        makeTask('t1', TaskStatus.NOT_STARTED, { dueDate: overdue }),
      ]),
      makeStage('s2', 1, new Date('2025-06-05T00:00:00Z'), [
        makeTask('t2', TaskStatus.COMPLETE),
      ]),
    ];

    const snap = getProgramSnapshot(START, stages, NOW);

    expect(snap.behindStageCount).toBe(1);
  });

  it('sums overdue tasks across all stages into totalRedTasks', () => {
    const overdue = new Date('2025-06-01T00:00:00Z');
    const stages = [
      makeStage('s1', 0, new Date('2025-06-01T00:00:00Z'), [
        makeTask('t1', TaskStatus.NOT_STARTED, { dueDate: overdue }),
      ]),
      makeStage('s2', 1, new Date('2025-06-05T00:00:00Z'), [
        makeTask('t2', TaskStatus.NOT_STARTED, { dueDate: overdue }),
        makeTask('t3', TaskStatus.COMPLETE),
      ]),
    ];

    const snap = getProgramSnapshot(START, stages, NOW);

    expect(snap.totalRedTasks).toBe(2);
  });

  it('aggregates progress across multiple stages and returns null daysInProgram when startDate is null', () => {
    const stages = [
      makeStage('s1', 0, new Date('2025-06-01T00:00:00Z'), [
        makeTask('t1', TaskStatus.COMPLETE),
        makeTask('t2', TaskStatus.NOT_STARTED),
      ]),
      makeStage('s2', 1, new Date('2025-06-05T00:00:00Z'), [
        makeTask('t3', TaskStatus.COMPLETE),
        makeTask('t4', TaskStatus.COMPLETE),
      ]),
    ];

    const snap = getProgramSnapshot(null, stages, NOW);

    expect(snap.daysInProgram).toBeNull();
    expect(snap.progress).toEqual({ completed: 3, total: 4 });
  });
});
