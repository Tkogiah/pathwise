import { describe, it, expect } from 'vitest';
import {
  StageInput,
  TaskInput,
  TaskStatus,
  StageStatus,
} from '@pathwise/types';
import {
  getStageStatus,
  shouldActivateStage,
  getStageProgress,
  getRedTaskCount,
  isStageBehind,
} from '../stage';

const now = new Date('2025-06-15T12:00:00Z');
const pastDate = new Date('2025-06-10T12:00:00Z');
const futureDate = new Date('2025-06-20T12:00:00Z');

function makeTask(overrides: Partial<TaskInput> = {}): TaskInput {
  return {
    id: 'task-1',
    status: TaskStatus.NOT_STARTED,
    isNa: false,
    isRequired: true,
    dueDate: null,
    dependsOnTaskId: null,
    ...overrides,
  };
}

function makeStage(overrides: Partial<StageInput> = {}): StageInput {
  return {
    id: 'stage-1',
    orderIndex: 0,
    activatedAt: new Date('2025-06-01'),
    tasks: [],
    ...overrides,
  };
}

// --- getStageStatus ---

describe('getStageStatus', () => {
  it('returns GRAY when not activated', () => {
    const stage = makeStage({ activatedAt: null, tasks: [makeTask()] });
    expect(getStageStatus(stage, now)).toBe(StageStatus.GRAY);
  });

  it('returns GREEN when all required tasks are complete', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.COMPLETE }),
        makeTask({ id: 't2', status: TaskStatus.COMPLETE }),
      ],
    });
    expect(getStageStatus(stage, now)).toBe(StageStatus.GREEN);
  });

  it('returns GREEN when required tasks are complete or N/A', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.COMPLETE }),
        makeTask({ id: 't2', isNa: true }),
      ],
    });
    expect(getStageStatus(stage, now)).toBe(StageStatus.GREEN);
  });

  it('returns GREEN when no required tasks exist', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', isRequired: false }),
        makeTask({ id: 't2', isRequired: false }),
      ],
    });
    expect(getStageStatus(stage, now)).toBe(StageStatus.GREEN);
  });

  it('returns GREEN with empty task list', () => {
    const stage = makeStage({ tasks: [] });
    expect(getStageStatus(stage, now)).toBe(StageStatus.GREEN);
  });

  it('returns RED when any required task is blocked', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.COMPLETE }),
        makeTask({ id: 't2', status: TaskStatus.BLOCKED }),
      ],
    });
    expect(getStageStatus(stage, now)).toBe(StageStatus.RED);
  });

  it('returns RED when any required task is overdue', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.COMPLETE }),
        makeTask({
          id: 't2',
          status: TaskStatus.IN_PROGRESS,
          dueDate: pastDate,
        }),
      ],
    });
    expect(getStageStatus(stage, now)).toBe(StageStatus.RED);
  });

  it('returns YELLOW when required tasks incomplete but no blockers or overdue', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.COMPLETE }),
        makeTask({ id: 't2', status: TaskStatus.IN_PROGRESS }),
      ],
    });
    expect(getStageStatus(stage, now)).toBe(StageStatus.YELLOW);
  });

  it('returns YELLOW when all required tasks are NOT_STARTED', () => {
    const stage = makeStage({
      tasks: [makeTask({ id: 't1' }), makeTask({ id: 't2' })],
    });
    expect(getStageStatus(stage, now)).toBe(StageStatus.YELLOW);
  });

  it('ignores optional tasks for status calculation', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.COMPLETE }),
        makeTask({
          id: 't2',
          isRequired: false,
          status: TaskStatus.BLOCKED,
        }),
      ],
    });
    // Only required task is complete, optional blocked task doesn't affect status
    expect(getStageStatus(stage, now)).toBe(StageStatus.GREEN);
  });

  it('returns RED when blocked optional task exists but required task is also overdue', () => {
    const stage = makeStage({
      tasks: [
        makeTask({
          id: 't1',
          status: TaskStatus.IN_PROGRESS,
          dueDate: pastDate,
        }),
        makeTask({
          id: 't2',
          isRequired: false,
          status: TaskStatus.BLOCKED,
        }),
      ],
    });
    expect(getStageStatus(stage, now)).toBe(StageStatus.RED);
  });
});

// --- shouldActivateStage ---

describe('shouldActivateStage', () => {
  it('returns true for first stage (no previous)', () => {
    const stage = makeStage();
    expect(shouldActivateStage(stage, null)).toBe(true);
  });

  it('returns true when previous stage has activity', () => {
    const previous = makeStage({
      id: 'prev',
      tasks: [makeTask({ status: TaskStatus.IN_PROGRESS })],
    });
    const stage = makeStage({ id: 'current', orderIndex: 1 });
    expect(shouldActivateStage(stage, previous)).toBe(true);
  });

  it('returns false when previous stage has no activity', () => {
    const previous = makeStage({
      id: 'prev',
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.NOT_STARTED }),
        makeTask({ id: 't2', status: TaskStatus.NOT_STARTED }),
      ],
    });
    const stage = makeStage({ id: 'current', orderIndex: 1 });
    expect(shouldActivateStage(stage, previous)).toBe(false);
  });

  it('returns true when previous stage has an N/A task (counts as activity)', () => {
    const previous = makeStage({
      id: 'prev',
      tasks: [makeTask({ status: TaskStatus.NOT_STARTED, isNa: true })],
    });
    const stage = makeStage({ id: 'current', orderIndex: 1 });
    expect(shouldActivateStage(stage, previous)).toBe(true);
  });

  it('returns true when previous stage has a complete task', () => {
    const previous = makeStage({
      id: 'prev',
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.NOT_STARTED }),
        makeTask({ id: 't2', status: TaskStatus.COMPLETE }),
      ],
    });
    const stage = makeStage({ id: 'current', orderIndex: 1 });
    expect(shouldActivateStage(stage, previous)).toBe(true);
  });

  it('returns true when previous stage has a blocked task', () => {
    const previous = makeStage({
      id: 'prev',
      tasks: [makeTask({ status: TaskStatus.BLOCKED })],
    });
    const stage = makeStage({ id: 'current', orderIndex: 1 });
    expect(shouldActivateStage(stage, previous)).toBe(true);
  });

  it('returns false when previous stage has empty task list', () => {
    const previous = makeStage({ id: 'prev', tasks: [] });
    const stage = makeStage({ id: 'current', orderIndex: 1 });
    expect(shouldActivateStage(stage, previous)).toBe(false);
  });
});

// --- getStageProgress ---

describe('getStageProgress', () => {
  it('returns 0/0 for no required tasks', () => {
    const stage = makeStage({
      tasks: [makeTask({ isRequired: false })],
    });
    expect(getStageProgress(stage)).toEqual({ completed: 0, total: 0 });
  });

  it('counts complete tasks', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.COMPLETE }),
        makeTask({ id: 't2', status: TaskStatus.IN_PROGRESS }),
        makeTask({ id: 't3', status: TaskStatus.NOT_STARTED }),
      ],
    });
    expect(getStageProgress(stage)).toEqual({ completed: 1, total: 3 });
  });

  it('counts N/A as completed', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.COMPLETE }),
        makeTask({ id: 't2', isNa: true }),
        makeTask({ id: 't3', status: TaskStatus.NOT_STARTED }),
      ],
    });
    expect(getStageProgress(stage)).toEqual({ completed: 2, total: 3 });
  });

  it('excludes optional tasks from count', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.COMPLETE }),
        makeTask({ id: 't2', isRequired: false, status: TaskStatus.COMPLETE }),
      ],
    });
    expect(getStageProgress(stage)).toEqual({ completed: 1, total: 1 });
  });

  it('returns 0/0 for empty task list', () => {
    const stage = makeStage({ tasks: [] });
    expect(getStageProgress(stage)).toEqual({ completed: 0, total: 0 });
  });
});

// --- getRedTaskCount ---

describe('getRedTaskCount', () => {
  it('returns 0 when no red tasks', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.IN_PROGRESS }),
        makeTask({ id: 't2', status: TaskStatus.COMPLETE }),
      ],
    });
    expect(getRedTaskCount(stage, now)).toBe(0);
  });

  it('counts blocked tasks', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.BLOCKED }),
        makeTask({ id: 't2', status: TaskStatus.IN_PROGRESS }),
      ],
    });
    expect(getRedTaskCount(stage, now)).toBe(1);
  });

  it('counts overdue tasks', () => {
    const stage = makeStage({
      tasks: [
        makeTask({
          id: 't1',
          status: TaskStatus.IN_PROGRESS,
          dueDate: pastDate,
        }),
        makeTask({
          id: 't2',
          status: TaskStatus.IN_PROGRESS,
          dueDate: futureDate,
        }),
      ],
    });
    expect(getRedTaskCount(stage, now)).toBe(1);
  });

  it('counts both blocked and overdue', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', status: TaskStatus.BLOCKED }),
        makeTask({
          id: 't2',
          status: TaskStatus.IN_PROGRESS,
          dueDate: pastDate,
        }),
        makeTask({ id: 't3', status: TaskStatus.COMPLETE }),
      ],
    });
    expect(getRedTaskCount(stage, now)).toBe(2);
  });

  it('includes optional red tasks in count', () => {
    const stage = makeStage({
      tasks: [
        makeTask({ id: 't1', isRequired: false, status: TaskStatus.BLOCKED }),
      ],
    });
    expect(getRedTaskCount(stage, now)).toBe(1);
  });

  it('returns 0 for empty task list', () => {
    const stage = makeStage({ tasks: [] });
    expect(getRedTaskCount(stage, now)).toBe(0);
  });
});

// --- isStageBehind ---

describe('isStageBehind', () => {
  it('returns false when stage is not yet activated', () => {
    const stage = makeStage({
      orderIndex: 0,
      activatedAt: null,
      tasks: [makeTask()],
    });
    const later = makeStage({
      id: 'later',
      orderIndex: 1,
      activatedAt: new Date('2025-06-05'),
    });
    expect(isStageBehind(stage, [stage, later], now)).toBe(false);
  });

  it('returns false when stage is GREEN (complete)', () => {
    const stage = makeStage({
      orderIndex: 0,
      tasks: [makeTask({ status: TaskStatus.COMPLETE })],
    });
    const later = makeStage({
      id: 'later',
      orderIndex: 1,
      activatedAt: new Date('2025-06-05'),
    });
    expect(isStageBehind(stage, [stage, later], now)).toBe(false);
  });

  it('returns false when active and YELLOW but no later stage is activated', () => {
    const stage = makeStage({ orderIndex: 0, tasks: [makeTask()] });
    const later = makeStage({ id: 'later', orderIndex: 1, activatedAt: null });
    expect(isStageBehind(stage, [stage, later], now)).toBe(false);
  });

  it('returns true when active, YELLOW, and a later stage has been activated', () => {
    const stage = makeStage({ orderIndex: 0, tasks: [makeTask()] });
    const later = makeStage({
      id: 'later',
      orderIndex: 1,
      activatedAt: new Date('2025-06-05'),
    });
    expect(isStageBehind(stage, [stage, later], now)).toBe(true);
  });

  it('returns true when active, RED, and a later stage has been activated', () => {
    const stage = makeStage({
      orderIndex: 0,
      tasks: [makeTask({ status: TaskStatus.BLOCKED })],
    });
    const later = makeStage({
      id: 'later',
      orderIndex: 1,
      activatedAt: new Date('2025-06-05'),
    });
    expect(isStageBehind(stage, [stage, later], now)).toBe(true);
  });

  it('returns true when later stage is GREEN (activated + complete)', () => {
    const stage = makeStage({ orderIndex: 0, tasks: [makeTask()] });
    const later = makeStage({
      id: 'later',
      orderIndex: 1,
      activatedAt: new Date('2025-06-05'),
      tasks: [makeTask({ id: 'lt1', status: TaskStatus.COMPLETE })],
    });
    expect(isStageBehind(stage, [stage, later], now)).toBe(true);
  });

  it('returns false when this is the last stage (no stages after)', () => {
    const stage = makeStage({ orderIndex: 2, tasks: [makeTask()] });
    const earlier = makeStage({
      id: 'e1',
      orderIndex: 0,
      activatedAt: new Date('2025-06-01'),
    });
    expect(isStageBehind(stage, [earlier, stage], now)).toBe(false);
  });

  it('ignores earlier stages when checking for activation', () => {
    const stage = makeStage({ orderIndex: 1, tasks: [makeTask()] });
    const earlier = makeStage({
      id: 'e1',
      orderIndex: 0,
      activatedAt: new Date('2025-06-01'),
    });
    const later = makeStage({ id: 'l1', orderIndex: 2, activatedAt: null });
    expect(isStageBehind(stage, [earlier, stage, later], now)).toBe(false);
  });
});
