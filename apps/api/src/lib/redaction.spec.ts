import { describe, it, expect } from 'vitest';
import { detectPii } from './redaction';

describe('detectPii', () => {
  it('detects SSN', () => {
    expect(detectPii('SSN: 123-45-6789')).toContain('SSN');
  });

  it('detects PHONE', () => {
    expect(detectPii('Call me at 503-555-1234')).toContain('PHONE');
  });

  it('detects EMAIL', () => {
    expect(detectPii('Email john@example.com for details')).toContain('EMAIL');
  });

  it('detects DOB', () => {
    expect(detectPii('DOB 03/15/1990')).toContain('DOB');
  });

  it('detects INCOME_AMOUNT', () => {
    expect(detectPii('Earns $1,200/month')).toContain('INCOME_AMOUNT');
  });

  it('detects ADDRESS (street number pattern)', () => {
    expect(detectPii('Lives at 123 Main St')).toContain('ADDRESS');
  });

  it('detects CASE_NUMBER', () => {
    expect(detectPii('Case #4567890 is pending')).toContain('CASE_NUMBER');
  });

  it('detects BENEFIT_ID', () => {
    expect(detectPii('EBT #123456789')).toContain('BENEFIT_ID');
  });

  it('returns empty array for clean clinical note', () => {
    expect(
      detectPii('Assisted client with housing application today.'),
    ).toEqual([]);
  });
});
