import { StageVM } from './types';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function isStageBehind(stage: StageVM): boolean {
  if (stage.status === 'GREEN') return false;
  if (!stage.activatedAt || !stage.recommendedDurationDays) return false;
  const activatedMs = new Date(stage.activatedAt).getTime();
  const deadlineMs =
    activatedMs + stage.recommendedDurationDays * 24 * 60 * 60 * 1000;
  return Date.now() > deadlineMs;
}
