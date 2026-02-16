'use client';

export type TaskFilter = 'all' | 'mine';

export function TaskFilterToggle({
  filter,
  onChangeFilter,
}: {
  filter: TaskFilter;
  onChangeFilter: (filter: TaskFilter) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Task filter"
      className="flex gap-1 rounded-lg border border-edge bg-surface-elevated p-1"
    >
      <button
        type="button"
        onClick={() => onChangeFilter('all')}
        aria-pressed={filter === 'all'}
        className={`rounded-md px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          filter === 'all'
            ? 'bg-accent text-white'
            : 'text-content-secondary hover:bg-surface-card'
        }`}
      >
        All Tasks
      </button>
      <button
        type="button"
        onClick={() => onChangeFilter('mine')}
        aria-pressed={filter === 'mine'}
        className={`rounded-md px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
          filter === 'mine'
            ? 'bg-accent text-white'
            : 'text-content-secondary hover:bg-surface-card'
        }`}
      >
        My Tasks
      </button>
    </div>
  );
}
