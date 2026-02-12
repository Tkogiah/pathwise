'use client';

import { useState, useEffect } from 'react';
import { RoadmapVM } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import { DEMO_USERS } from '@/lib/demo-users';
import { RoadmapTabs } from './RoadmapTabs';
import { RoadmapView } from './RoadmapView';
import { DemoUserSelector } from './DemoUserSelector';

interface RoadmapSummary {
  roadmapId: string;
  templateName: string;
}

const LOCAL_STORAGE_KEY = 'pathwise-demo-user-id';

export function ClientRoadmapShell({
  roadmaps,
  initialRoadmap,
}: {
  roadmaps: RoadmapSummary[];
  initialRoadmap: RoadmapVM;
}) {
  const [selectedRoadmapId, setSelectedRoadmapId] = useState(initialRoadmap.id);
  const [roadmapData, setRoadmapData] = useState<RoadmapVM>(initialRoadmap);
  const [loading, setLoading] = useState(false);
  const [currentDemoUserId, setCurrentDemoUserId] = useState<string | null>(
    null,
  );

  // Initialize demo user from localStorage
  useEffect(() => {
    const savedUserId = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedUserId) {
      setCurrentDemoUserId(savedUserId);
    } else {
      setCurrentDemoUserId(DEMO_USERS[0]?.id || null);
    }
  }, []);

  // Persist demo user to localStorage
  useEffect(() => {
    if (currentDemoUserId) {
      localStorage.setItem(LOCAL_STORAGE_KEY, currentDemoUserId);
    }
  }, [currentDemoUserId]);

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
        <DemoUserSelector
          users={DEMO_USERS}
          currentUserId={currentDemoUserId}
          onSelectUser={setCurrentDemoUserId}
        />
      </div>

      <div
        id={`roadmap-panel-${selectedRoadmapId}`}
        role="tabpanel"
        aria-labelledby={`roadmap-tab-${selectedRoadmapId}`}
      >
        {loading ? (
          <div className="flex h-32 items-center justify-center">
            <p className="text-sm text-gray-500">Loading roadmap...</p>
          </div>
        ) : (
          <RoadmapView
            key={selectedRoadmapId}
            initialRoadmap={roadmapData}
            currentDemoUserId={currentDemoUserId}
          />
        )}
      </div>
    </div>
  );
}
