// PII patterns mirror apps/api/src/lib/redaction.ts but mask inline rather than reject.
// Keep in sync when adding new categories.
const PII_PATTERNS: Array<{ category: string; source: string }> = [
  { category: 'SSN', source: String.raw`\b\d{3}-\d{2}-\d{4}\b` },
  { category: 'PHONE', source: String.raw`\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}` },
  {
    category: 'EMAIL',
    source: String.raw`[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}`,
  },
  {
    category: 'DOB',
    source: String.raw`\b(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}\b`,
  },
  {
    category: 'INCOME_AMOUNT',
    source: String.raw`\$[\d,]+|\b\d+\s*(dollars|\/month|\/yr)\b`,
  },
  {
    category: 'ADDRESS',
    source: String.raw`\b\d{1,5}\s+\w+\s+(st|ave|blvd|rd|dr|ln|ct|pl|way)\b`,
  },
  { category: 'CASE_NUMBER', source: String.raw`\bcase\s*#?\s*\d{4,}\b` },
  { category: 'BENEFIT_ID', source: String.raw`\bebt\s*#?\s*\d{6,}\b` },
];

export interface RedactResult {
  redacted: string;
  categories: string[];
}

/**
 * Masks PII in-place, returning the cleaned text and a list of redacted categories.
 * The Pathwise API still runs detectPii() as a safety net; this must pass before sending.
 */
export function redactText(text: string): RedactResult {
  const categories: string[] = [];
  let redacted = text;

  for (const { category, source } of PII_PATTERNS) {
    const pattern = new RegExp(source, 'gi');
    if (pattern.test(redacted)) {
      categories.push(category);
      redacted = redacted.replace(new RegExp(source, 'gi'), `[${category} REDACTED]`);
    }
  }

  return { redacted, categories };
}
