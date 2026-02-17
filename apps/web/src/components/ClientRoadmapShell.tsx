'use client';

import { useState } from 'react';
import { RoadmapVM } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import { RoadmapTabs } from './RoadmapTabs';
import { RoadmapView } from './RoadmapView';
import { NotesRail } from './NotesRail';
import { useDemoUser } from './DemoUserProvider';

interface RoadmapSummary {
  roadmapId: string;
  templateName: string;
}

export function ClientRoadmapShell({
  clientId,
  roadmaps,
  initialRoadmap,
  isArchived = false,
}: {
  clientId: string;
  roadmaps: RoadmapSummary[];
  initialRoadmap: RoadmapVM;
  isArchived?: boolean;
}) {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(initialRoadmap.id);
  const [roadmapData, setRoadmapData] = useState<RoadmapVM>(initialRoadmap);
  const [loading, setLoading] = useState(false);
  const [pendingNav, setPendingNav] = useState<{
    stageId: string;
    taskId: string;
  } | null>(null);
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

  const handleNavigateToTask = async (
    roadmapId: string,
    stageId: string,
    taskId: string,
  ) => {
    if (roadmapId !== selectedRoadmapId) {
      await handleSelectRoadmap(roadmapId);
    }
    setPendingNav({ stageId, taskId });
  };

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_280px]">
      <div className="min-w-0 space-y-4">
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
              <p className="text-base text-content-muted">Loading roadmap...</p>
            </div>
          ) : (
            <RoadmapView
              key={selectedRoadmapId}
              initialRoadmap={roadmapData}
              currentDemoUserId={currentDemoUserId}
              isArchived={isArchived}
              pendingNav={pendingNav}
              onPendingNavHandled={() => setPendingNav(null)}
            />
          )}
        </div>
      </div>

      <NotesRail
        clientId={clientId}
        currentDemoUserId={currentDemoUserId}
        onNavigateToTask={(roadmapId, stageId, taskId) =>
          void handleNavigateToTask(roadmapId, stageId, taskId)
        }
      />
    </div>
  );
}
