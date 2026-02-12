'use client';

interface RoadmapSummary {
  roadmapId: string;
  templateName: string;
}

export function RoadmapTabs({
  roadmaps,
  selectedRoadmapId,
  onSelectRoadmap,
}: {
  roadmaps: RoadmapSummary[];
  selectedRoadmapId: string;
  onSelectRoadmap: (id: string) => void;
}) {
  if (roadmaps.length <= 1) return null;

  return (
    <div className="flex gap-1 border-b border-gray-200">
      {roadmaps.map((rm) => (
        <button
          key={rm.roadmapId}
          onClick={() => onSelectRoadmap(rm.roadmapId)}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            selectedRoadmapId === rm.roadmapId
              ? 'border-b-2 border-gray-900 text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          {rm.templateName}
        </button>
      ))}
    </div>
  );
}
