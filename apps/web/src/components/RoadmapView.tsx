'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoadmapVM, TaskVM } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import { isStageBehind } from '@/lib/utils';
import { RoadmapBar } from './RoadmapBar';
import { StageDetailList } from './StageDetailList';
import { TaskDrawer } from './TaskDrawer';
import { HandoffSummary } from './HandoffSummary';
import { TaskFilterToggle, TaskFilter } from './TaskFilterToggle';
import { ProgressArc } from './ProgressArc';
import { ProgramMetadata } from './ProgramMetadata';

export function RoadmapView({
  initialRoadmap,
  currentDemoUserId,
  isArchived = false,
}: {
  initialRoadmap: RoadmapVM;
  currentDemoUserId: string | null;
  isArchived?: boolean;
}) {
  const [currentRoadmap, setCurrentRoadmap] = useState(initialRoadmap);
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<TaskVM | null>(null);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');

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
    const updated = await apiFetch<RoadmapVM>(`/roadmaps/${currentRoadmap.id}`);
    setCurrentRoadmap(updated);
    // Update selected task with fresh data if drawer is open
    if (selectedTask) {
      const freshTask = updated.stages
        .flatMap((s) => s.tasks)
        .find((t) => t.id === selectedTask.id);
      setSelectedTask(freshTask ?? null);
    }
  }, [currentRoadmap.id, selectedTask]);

  const handleSelectStage = (id: string) => {
    setSelectedStageId((prev) => {
      if (prev === id) {
        setSelectedTask(null);
        return null;
      }
      return id;
    });
  };

  const handleBackToOverview = () => {
    setSelectedStageId(null);
    setSelectedTask(null);
  };

  const handleSelectTask = (task: TaskVM) => {
    setSelectedTask(task);
  };

  const handleCloseDrawer = () => {
    setSelectedTask(null);
  };

  const selectedStage = currentRoadmap.stages.find(
    (s) => s.id === selectedStageId,
  );

  const overallCompleted = currentRoadmap.stages.reduce(
    (sum, s) => sum + s.progress.completed,
    0,
  );
  const overallTotal = currentRoadmap.stages.reduce(
    (sum, s) => sum + s.progress.total,
    0,
  );

  const stageArcColor = selectedStage
    ? {
        GREEN: 'success' as const,
        YELLOW: 'warning' as const,
        RED: 'error' as const,
        GRAY: 'inactive' as const,
      }[selectedStage.status]
    : 'accent';

  const filteredTasks =
    selectedStage && taskFilter === 'mine'
      ? selectedStage.tasks.filter(
          (t) => t.assignedUser?.id === currentDemoUserId,
        )
      : (selectedStage?.tasks ?? []);

  return (
    <>
      <div className="space-y-4">
        <ProgramMetadata
          roadmapId={currentRoadmap.id}
          startDate={currentRoadmap.startDate}
          programLengthDays={currentRoadmap.programLengthDays}
          readOnly={isArchived}
          onUpdated={refreshRoadmap}
        />
        <RoadmapBar
          stages={currentRoadmap.stages}
          selectedStageId={selectedStageId}
          onSelectStage={handleSelectStage}
        />

        {!selectedStage && (
          <div className="flex h-28 flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-edge">
            <ProgressArc
              completed={overallCompleted}
              total={overallTotal}
              size={64}
              strokeWidth={6}
            />
            <p className="text-sm text-content-muted">
              Select a stage to view tasks
            </p>
          </div>
        )}

        {selectedStage && (
          <div className="mt-4 space-y-4">
            <button
              type="button"
              onClick={handleBackToOverview}
              className="text-sm text-content-muted hover:text-content-secondary"
            >
              &larr; Overview
            </button>

            <section className="rounded-lg border border-edge bg-surface-elevated px-4 py-3">
              <div className="flex items-center gap-3">
                <ProgressArc
                  completed={selectedStage.progress.completed}
                  total={selectedStage.progress.total}
                  size={40}
                  strokeWidth={4}
                  color={stageArcColor}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold text-content-primary">
                      {selectedStage.title}
                    </h2>
                    {isStageBehind(selectedStage) && (
                      <span className="rounded-full border border-status-error-border bg-status-error-bg px-2 py-0.5 text-[10px] font-medium text-status-error">
                        Behind schedule
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-content-muted">
                    {selectedStage.progress.completed} of{' '}
                    {selectedStage.progress.total} tasks complete
                    {selectedStage.timelineLabel &&
                      ` · Target: ${selectedStage.timelineLabel}`}
                  </p>
                </div>
              </div>
              <HandoffSummary
                stageId={selectedStage.id}
                summary={selectedStage.handoffSummary}
                onUpdated={refreshRoadmap}
                readOnly={isArchived}
              />
            </section>

            <div className="flex items-center justify-between">
              <TaskFilterToggle
                filter={taskFilter}
                onChangeFilter={setTaskFilter}
              />
            </div>

            <StageDetailList
              tasks={filteredTasks}
              onSelectTask={handleSelectTask}
              emptyMessage={
                taskFilter === 'mine'
                  ? 'No tasks assigned to you in this stage.'
                  : undefined
              }
            />
          </div>
        )}
      </div>
      <TaskDrawer
        task={selectedTask}
        onClose={handleCloseDrawer}
        onTaskUpdated={refreshRoadmap}
        readOnly={isArchived}
      />
    </>
  );
}
