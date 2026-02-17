import { NoteLabel } from './types';
import { DEMO_USERS } from './demo-users';

export const NOTE_LABELS: Record<NoteLabel, string> = {
  APPOINTMENT: 'Appointment',
  DOCUMENTS: 'Documents',
  HOUSING_SEARCH: 'Housing Search',
  VOUCHER: 'Voucher',
  BENEFITS: 'Benefits',
  OUTREACH: 'Outreach',
  ID_VERIFICATION: 'ID Verification',
  BARRIER: 'Barrier',
  TASK_UPDATE: 'Task Update',
  OTHER: 'Other',
};

export const ALL_LABELS = Object.keys(NOTE_LABELS) as NoteLabel[];

/** Placeholder for Phase 7.5 icon integration. */
export function getLabelIcon(label: NoteLabel): string | null {
  switch (label) {
    case 'APPOINTMENT':
      return '📅';
    case 'DOCUMENTS':
      return '📄';
    case 'HOUSING_SEARCH':
      return '🏠';
    case 'VOUCHER':
      return '🧾';
    case 'BENEFITS':
      return '💳';
    case 'OUTREACH':
      return '📞';
    case 'ID_VERIFICATION':
      return '🪪';
    case 'BARRIER':
      return '⚠️';
    case 'TASK_UPDATE':
      return '✅';
    case 'OTHER':
      return '📝';
    default:
      return null;
  }
}

export function getAuthorName(authorId: string): string {
  return DEMO_USERS.find((u) => u.id === authorId)?.name ?? authorId;
}

export function timeAgo(dateString: string): string {
  const ms = Date.now() - new Date(dateString).getTime();
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
