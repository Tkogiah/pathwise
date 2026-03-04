const PII_PATTERNS: Array<{ category: string; pattern: RegExp }> = [
  { category: 'SSN', pattern: /\b\d{3}-\d{2}-\d{4}\b/ },
  { category: 'PHONE', pattern: /\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/ },
  {
    category: 'EMAIL',
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
  },
  {
    category: 'DOB',
    pattern: /\b(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}\b/,
  },
  {
    category: 'INCOME_AMOUNT',
    pattern: /\$[\d,]+|\b\d+\s*(dollars|\/month|\/yr)\b/i,
  },
  // TODO: address detection requires a more sophisticated approach (NLP or address parser).
  // The naive pattern below catches common US street formats but will miss many variations.
  {
    category: 'ADDRESS',
    pattern: /\b\d{1,5}\s+\w+\s+(st|ave|blvd|rd|dr|ln|ct|pl|way)\b/i,
  },
  // TODO: case/benefit ID patterns are program-specific (DHS case numbers, EBT IDs, etc.).
  // Refine these regexes once the program's exact formats are known.
  { category: 'CASE_NUMBER', pattern: /\bcase\s*#?\s*\d{4,}\b/i },
  { category: 'BENEFIT_ID', pattern: /\bebt\s*#?\s*\d{6,}\b/i },
];

/**
 * Scans text for PII patterns.
 * Returns an array of matched category names, empty if clean.
 */
export function detectPii(text: string): string[] {
  return PII_PATTERNS.filter(({ pattern }) => pattern.test(text)).map(
    ({ category }) => category,
  );
}
