'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoadmapVM, TaskVM } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import { DEMO_USERS } from '@/lib/demo-users';
import { RoadmapBar } from './RoadmapBar';
import { StageDetailList } from './StageDetailList';
import { TaskDrawer } from './TaskDrawer';
import { DemoUserSelector } from './DemoUserSelector';
import { HandoffSummary } from './HandoffSummary';

const LOCAL_STORAGE_KEY = 'pathwise-demo-user-id';

function getDefaultStageId(roadmap: RoadmapVM): string {
  const firstActivated = roadmap.stages.find((s) => s.activatedAt !== null);
  return firstActivated?.id ?? roadmap.stages[0].id;
}

export function RoadmapView({ initialRoadmap }: { initialRoadmap: RoadmapVM }) {
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [selectedStageId, setSelectedStageId] = useState(() =>
    getDefaultStageId(initialRoadmap),
  );
  const [selectedTask, setSelectedTask] = useState<TaskVM | null>(null);
  const [currentDemoUserId, setCurrentDemoUserId] = useState<string | null>(
    null,
  );

  // Initialize from localStorage
  useEffect(() => {
    const savedUserId = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedUserId) {
      setCurrentDemoUserId(savedUserId);
    } else {
      setCurrentDemoUserId(DEMO_USERS[0]?.id || null);
    }
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (currentDemoUserId) {
      localStorage.setItem(LOCAL_STORAGE_KEY, currentDemoUserId);
    }
  }, [currentDemoUserId]);

  useEffect(() => {
    if (selectedTask) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [selectedTask]);

  const refreshRoadmap = useCallback(async () => {
    const updated = await apiFetch<RoadmapVM>(`/roadmaps/${roadmap.id}`);
    setRoadmap(updated);
    // Update selected task with fresh data if drawer is open
    if (selectedTask) {
      const freshTask = updated.stages
        .flatMap((s) => s.tasks)
        .find((t) => t.id === selectedTask.id);
      setSelectedTask(freshTask ?? null);
    }
  }, [roadmap.id, selectedTask]);

  const handleSelectTask = (task: TaskVM) => {
    setSelectedTask(task);
  };

  const handleCloseDrawer = () => {
    setSelectedTask(null);
  };

  const selectedStage = roadmap.stages.find((s) => s.id === selectedStageId);

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <DemoUserSelector
            users={DEMO_USERS}
            currentUserId={currentDemoUserId}
            onSelectUser={setCurrentDemoUserId}
          />
        </div>

        <RoadmapBar
          stages={roadmap.stages}
          selectedStageId={selectedStageId}
          onSelectStage={setSelectedStageId}
        />

        {selectedStage && (
          <div className="mt-4 space-y-4">
            <section className="rounded-lg border border-gray-200 bg-white px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-900">
                {selectedStage.title}
              </h2>
              <p className="mt-1 text-xs text-gray-500">
                {selectedStage.progress.completed} of{' '}
                {selectedStage.progress.total} tasks complete
              </p>
              <HandoffSummary
                stageId={selectedStage.id}
                summary={selectedStage.handoffSummary}
                onUpdated={refreshRoadmap}
              />
            </section>

            <StageDetailList
              tasks={selectedStage.tasks}
              onSelectTask={handleSelectTask}
            />
          </div>
        )}
      </div>
      <TaskDrawer
        task={selectedTask}
        onClose={handleCloseDrawer}
        onTaskUpdated={refreshRoadmap}
      />
    </>
  );
}
