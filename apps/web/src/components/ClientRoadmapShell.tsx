'use client';

import { useState } from 'react';
import { RoadmapVM } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import { RoadmapTabs } from './RoadmapTabs';
import { RoadmapView } from './RoadmapView';
import { useDemoUser } from './DemoUserProvider';

interface RoadmapSummary {
  roadmapId: string;
  templateName: string;
}

export function ClientRoadmapShell({
  roadmaps,
  initialRoadmap,
  isArchived = false,
}: {
  roadmaps: RoadmapSummary[];
  initialRoadmap: RoadmapVM;
  isArchived?: boolean;
}) {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(initialRoadmap.id);
  const [roadmapData, setRoadmapData] = useState<RoadmapVM>(initialRoadmap);
  const [loading, setLoading] = useState(false);
  const { currentDemoUserId } = useDemoUser();

  const handleSelectRoadmap = async (roadmapId: string) => {
    if (roadmapId === selectedRoadmapId) return;
    setSelectedRoadmapId(roadmapId);
    setLoading(true);
    try {
      const data = await apiFetch<RoadmapVM>(`/roadmaps/${roadmapId}`);
      setRoadmapData(data);
    } catch {
      // TODO: error handling
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <RoadmapTabs
          roadmaps={roadmaps}
          selectedRoadmapId={selectedRoadmapId}
          onSelectRoadmap={(id) => void handleSelectRoadmap(id)}
        />
      </div>

      <div
        id={`roadmap-panel-${selectedRoadmapId}`}
        role="tabpanel"
        aria-labelledby={`roadmap-tab-${selectedRoadmapId}`}
      >
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-content-muted">Loading roadmap...</p>
          </div>
        ) : (
          <RoadmapView
            key={selectedRoadmapId}
            initialRoadmap={roadmapData}
            currentDemoUserId={currentDemoUserId}
            isArchived={isArchived}
          />
        )}
      </div>
    </div>
  );
}
