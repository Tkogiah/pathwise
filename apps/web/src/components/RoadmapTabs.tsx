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
  if (roadmaps.length === 0) return null;

  return (
    <div
      role="tablist"
      aria-label="Client roadmaps"
      className="flex gap-1 border-b border-edge"
    >
      {roadmaps.map((rm) => {
        const isSelected = selectedRoadmapId === rm.roadmapId;
        const tabId = `roadmap-tab-${rm.roadmapId}`;
        const panelId = `roadmap-panel-${rm.roadmapId}`;
        return (
          <button
            key={rm.roadmapId}
            id={tabId}
            role="tab"
            aria-selected={isSelected}
            aria-controls={panelId}
            tabIndex={isSelected ? 0 : -1}
            type="button"
            onClick={() => onSelectRoadmap(rm.roadmapId)}
            className={`px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              isSelected
                ? 'border-b-2 border-accent text-content-primary'
                : 'text-content-muted hover:text-content-secondary'
            }`}
          >
            {rm.templateName}
          </button>
        );
      })}
    </div>
  );
}
