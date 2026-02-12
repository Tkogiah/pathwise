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
      className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1"
    >
      <button
        type="button"
        onClick={() => onChangeFilter('all')}
        aria-pressed={filter === 'all'}
        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${
          filter === 'all'
            ? 'bg-gray-900 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        All Tasks
      </button>
      <button
        type="button"
        onClick={() => onChangeFilter('mine')}
        aria-pressed={filter === 'mine'}
        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 ${
          filter === 'mine'
            ? 'bg-gray-900 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        My Tasks
      </button>
    </div>
  );
}
