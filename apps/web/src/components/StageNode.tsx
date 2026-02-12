'use client';

import { StageVM } from '@/lib/types';

const STATUS_DOT: Record<StageVM['status'], string> = {
  GREEN: 'bg-emerald-500',
  YELLOW: 'bg-amber-400',
  RED: 'bg-red-500',
  GRAY: 'bg-gray-300',
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

  return (
    <button
      type="button"
      onClick={onSelect}
      title={`${completed} of ${total} tasks complete`}
      aria-label={`${stage.title} — ${statusLabel}, ${completed} of ${total} complete`}
      aria-current={selected ? 'true' : undefined}
      className={`relative flex w-20 shrink-0 flex-col items-center rounded-lg border px-2 py-2.5 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 md:w-24 ${
        selected
          ? 'border-gray-400 bg-white ring-2 ring-gray-300'
          : 'border-gray-200 bg-white hover:border-gray-300'
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
      <span className="mt-1 line-clamp-1 text-[11px] font-medium leading-tight text-gray-700 md:text-xs">
        {stage.title}
      </span>
      <span className="mt-0.5 text-[10px] text-gray-400 md:text-xs">
        {completed}/{total}
      </span>
      {stage.redTaskCount > 0 && (
        <span
          className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white"
          aria-label={`${stage.redTaskCount} overdue or blocked tasks`}
        >
          {stage.redTaskCount}
        </span>
      )}
    </button>
  );
}
