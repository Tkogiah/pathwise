import { describe, it, expect } from 'vitest';
import { TaskInput, TaskStatus } from '@pathwise/types';
import {
  isTaskOverdue,
  isTaskLocked,
  isTaskRed,
  getTaskColor,
  computeDueDate,
} from '../task';

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

// --- computeDueDate ---

describe('computeDueDate', () => {
  it('adds offset days to start date', () => {
    const start = new Date('2025-01-01T00:00:00Z');
    const result = computeDueDate(start, 7);
    expect(result.toISOString().slice(0, 10)).toBe('2025-01-08');
  });

  it('returns same day when offset is 0', () => {
    const start = new Date('2025-06-15T00:00:00Z');
    const result = computeDueDate(start, 0);
    expect(result.toISOString().slice(0, 10)).toBe('2025-06-15');
  });

  it('handles month boundary correctly', () => {
    const start = new Date('2025-01-28T00:00:00Z');
    const result = computeDueDate(start, 7);
    expect(result.toISOString().slice(0, 10)).toBe('2025-02-04');
  });

  it('does not mutate the input date', () => {
    const start = new Date('2025-03-01T00:00:00Z');
    const original = start.toISOString();
    computeDueDate(start, 14);
    expect(start.toISOString()).toBe(original);
  });
});

// --- isTaskOverdue ---

describe('isTaskOverdue', () => {
  it('returns true when due date is past and not complete', () => {
    const task = makeTask({
      dueDate: pastDate,
      status: TaskStatus.IN_PROGRESS,
    });
    expect(isTaskOverdue(task, now)).toBe(true);
  });

  it('returns false when complete even if past due', () => {
    const task = makeTask({ dueDate: pastDate, status: TaskStatus.COMPLETE });
    expect(isTaskOverdue(task, now)).toBe(false);
  });

  it('returns false when N/A even if past due', () => {
    const task = makeTask({ dueDate: pastDate, isNa: true });
    expect(isTaskOverdue(task, now)).toBe(false);
  });

  it('returns false when no due date', () => {
    const task = makeTask({ status: TaskStatus.IN_PROGRESS });
    expect(isTaskOverdue(task, now)).toBe(false);
  });

  it('returns false when due date is in the future', () => {
    const task = makeTask({
      dueDate: futureDate,
      status: TaskStatus.IN_PROGRESS,
    });
    expect(isTaskOverdue(task, now)).toBe(false);
  });

  it('returns true when blocked and past due', () => {
    const task = makeTask({ dueDate: pastDate, status: TaskStatus.BLOCKED });
    expect(isTaskOverdue(task, now)).toBe(true);
  });
});

// --- isTaskLocked ---

describe('isTaskLocked', () => {
  it('returns false when no dependency', () => {
    const task = makeTask();
    expect(isTaskLocked(task, [task])).toBe(false);
  });

  it('returns true when required dependency is not complete', () => {
    const dep = makeTask({ id: 'dep-1', status: TaskStatus.IN_PROGRESS });
    const task = makeTask({ id: 'task-1', dependsOnTaskId: 'dep-1' });
    expect(isTaskLocked(task, [dep, task])).toBe(true);
  });

  it('returns false when required dependency is complete', () => {
    const dep = makeTask({ id: 'dep-1', status: TaskStatus.COMPLETE });
    const task = makeTask({ id: 'task-1', dependsOnTaskId: 'dep-1' });
    expect(isTaskLocked(task, [dep, task])).toBe(false);
  });

  it('returns false when dependency is N/A (counts as complete)', () => {
    const dep = makeTask({
      id: 'dep-1',
      status: TaskStatus.NOT_STARTED,
      isNa: true,
    });
    const task = makeTask({ id: 'task-1', dependsOnTaskId: 'dep-1' });
    expect(isTaskLocked(task, [dep, task])).toBe(false);
  });

  it('returns false when dependency is not required', () => {
    const dep = makeTask({
      id: 'dep-1',
      status: TaskStatus.NOT_STARTED,
      isRequired: false,
    });
    const task = makeTask({ id: 'task-1', dependsOnTaskId: 'dep-1' });
    expect(isTaskLocked(task, [dep, task])).toBe(false);
  });

  it('returns false when dependency not found in task list', () => {
    const task = makeTask({ dependsOnTaskId: 'missing-id' });
    expect(isTaskLocked(task, [task])).toBe(false);
  });

  it('returns true when dependency is blocked', () => {
    const dep = makeTask({ id: 'dep-1', status: TaskStatus.BLOCKED });
    const task = makeTask({ id: 'task-1', dependsOnTaskId: 'dep-1' });
    expect(isTaskLocked(task, [dep, task])).toBe(true);
  });
});

// --- isTaskRed ---

describe('isTaskRed', () => {
  it('returns true when blocked', () => {
    const task = makeTask({ status: TaskStatus.BLOCKED });
    expect(isTaskRed(task, now)).toBe(true);
  });

  it('returns true when overdue', () => {
    const task = makeTask({
      dueDate: pastDate,
      status: TaskStatus.IN_PROGRESS,
    });
    expect(isTaskRed(task, now)).toBe(true);
  });

  it('returns false when in progress and not overdue', () => {
    const task = makeTask({
      dueDate: futureDate,
      status: TaskStatus.IN_PROGRESS,
    });
    expect(isTaskRed(task, now)).toBe(false);
  });

  it('returns false when complete', () => {
    const task = makeTask({ status: TaskStatus.COMPLETE });
    expect(isTaskRed(task, now)).toBe(false);
  });
});

// --- getTaskColor ---

describe('getTaskColor', () => {
  it('returns gray when locked', () => {
    const dep = makeTask({ id: 'dep-1', status: TaskStatus.NOT_STARTED });
    const task = makeTask({ id: 'task-1', dependsOnTaskId: 'dep-1' });
    expect(getTaskColor(task, [dep, task], now)).toBe('gray');
  });

  it('returns red when blocked', () => {
    const task = makeTask({ status: TaskStatus.BLOCKED });
    expect(getTaskColor(task, [task], now)).toBe('red');
  });

  it('returns red when overdue', () => {
    const task = makeTask({
      dueDate: pastDate,
      status: TaskStatus.IN_PROGRESS,
    });
    expect(getTaskColor(task, [task], now)).toBe('red');
  });

  it('returns green when complete', () => {
    const task = makeTask({ status: TaskStatus.COMPLETE });
    expect(getTaskColor(task, [task], now)).toBe('green');
  });

  it('returns blue when N/A', () => {
    const task = makeTask({ isNa: true });
    expect(getTaskColor(task, [task], now)).toBe('blue');
  });

  it('returns yellow when in progress and not overdue', () => {
    const task = makeTask({
      status: TaskStatus.IN_PROGRESS,
      dueDate: futureDate,
    });
    expect(getTaskColor(task, [task], now)).toBe('yellow');
  });

  it('returns gray when not started', () => {
    const task = makeTask({ status: TaskStatus.NOT_STARTED });
    expect(getTaskColor(task, [task], now)).toBe('gray');
  });

  it('locked takes priority over red', () => {
    // Task is both locked (dependency incomplete) and blocked
    const dep = makeTask({ id: 'dep-1', status: TaskStatus.NOT_STARTED });
    const task = makeTask({
      id: 'task-1',
      dependsOnTaskId: 'dep-1',
      status: TaskStatus.BLOCKED,
    });
    expect(getTaskColor(task, [dep, task], now)).toBe('gray');
  });
});
