import { describe, it, expect } from 'vitest';
import { daysInProgram } from '../program';

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
