'use client';

import { StageVM } from '@/lib/types';
import { slugify, isStageBehind } from '@/lib/utils';

const STATUS_DOT: Record<StageVM['status'], string> = {
  GREEN: 'bg-status-success',
  YELLOW: 'bg-status-warning',
  RED: 'bg-status-error',
  GRAY: 'bg-status-inactive',
};

const STATUS_BG: Record<StageVM['status'], string> = {
  GREEN: 'bg-status-success-bg',
  YELLOW: 'bg-surface-elevated',
  RED: 'bg-surface-elevated',
  GRAY: 'bg-surface-elevated',
};

const STATUS_LABEL: Record<StageVM['status'], string> = {
  GREEN: 'On Track',
  YELLOW: 'In Progress',
  RED: 'At Risk',
  GRAY: 'Not Started',
};

const ICON_MAP: Record<string, string> = {
  clipboard: '\u{1F4CB}',
  folder: '\u{1F4C1}',
  search: '\u{1F50D}',
  home: '\u{1F3E0}',
  shield: '\u{1F6E1}\uFE0F',
  document: '\u{1F4C4}',
  flag: '\u{1F3C1}',
};

export function StageNode({
  stage,
  selected,
  onSelect,
}: {
  stage: StageVM;
  selected: boolean;
  onSelect: () => void;
}) {
  const { completed, total } = stage.progress;
  const icon = ICON_MAP[stage.iconName] ?? '\u{1F4CC}';
  const statusLabel = STATUS_LABEL[stage.status];
  const slug = slugify(stage.title);
  const nodeBg = STATUS_BG[stage.status];
  const behind = isStageBehind(stage);

  return (
    <button
      type="button"
      onClick={onSelect}
      title={`${completed} of ${total} tasks complete`}
      aria-label={`${stage.title} — ${statusLabel}, ${completed} of ${total} complete`}
      aria-current={selected ? 'true' : undefined}
      data-testid={`stage-node-${slug}`}
      className={`relative flex w-24 shrink-0 flex-col items-center rounded-lg border px-2 py-2.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:w-28 ${
        selected
          ? `border-edge ${nodeBg} ring-2 ring-accent`
          : `border-edge ${nodeBg} hover:border-accent`
      }`}
    >
      <span
        className={`mb-1 h-2 w-2 rounded-full ${STATUS_DOT[stage.status]}`}
        aria-hidden="true"
      />
      <span className="sr-only">{statusLabel}</span>
      <span className="text-base leading-none" aria-hidden="true">
        {icon}
      </span>
      <span className="mt-1 line-clamp-2 text-[11px] font-medium leading-tight text-content-secondary md:text-xs">
        {stage.title}
      </span>
      <span
        className="mt-0.5 text-[10px] text-content-muted md:text-xs"
        data-testid={`stage-progress-${slug}`}
      >
        {completed}/{total}
      </span>
      {behind && (
        <span className="mt-0.5 text-[9px] font-medium text-status-error">
          Behind
        </span>
      )}
      {stage.redTaskCount > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-status-error text-[10px] font-semibold text-white"
          aria-label={`${stage.redTaskCount} overdue or blocked tasks`}
        >
          {stage.redTaskCount}
        </span>
      )}
    </button>
  );
}
