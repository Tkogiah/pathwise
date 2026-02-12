'use client';

export function RoadmapSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Client Name and Demo User Selector Placeholder */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="h-10 w-64 rounded-lg bg-gray-200" />
      </div>

      {/* Roadmap Bar Placeholder */}
      <div className="flex space-x-2 overflow-hidden py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-24 w-24 shrink-0 rounded-lg bg-gray-200" />
        ))}
      </div>

      {/* Selected Stage Info Placeholder */}
      <section className="h-20 rounded-lg border border-gray-200 bg-white px-4 py-3" />

      {/* Task List Placeholder */}
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-16 rounded-md border border-gray-200 bg-white p-2"
          />
        ))}
      </div>
    </div>
  );
}
