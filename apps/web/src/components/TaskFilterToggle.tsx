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
    <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1">
      <button
        onClick={() => onChangeFilter('all')}
        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
          filter === 'all'
            ? 'bg-gray-900 text-white'
            : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        All Tasks
      </button>
      <button
        onClick={() => onChangeFilter('mine')}
        className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
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
