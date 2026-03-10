'use client';

import { useState, useEffect, useCallback } from 'react';
import { RoadmapVM, TaskVM } from '@/lib/types';
import { apiFetch } from '@/lib/api';
import { RoadmapBar } from './RoadmapBar';
import { StageDetailList } from './StageDetailList';
import { TaskDrawer } from './TaskDrawer';
import { HandoffSummary } from './HandoffSummary';
import { TaskFilterToggle, TaskFilter } from './TaskFilterToggle';
import { ProgressArc } from './ProgressArc';
import { OverviewSummary } from './OverviewSummary';

export function RoadmapView({
  initialRoadmap,
  currentUserId,
  isArchived = false,
  pendingNav,
  onPendingNavHandled,
}: {
  initialRoadmap: RoadmapVM;
  currentUserId: string | null;
  isArchived?: boolean;
  pendingNav?: { stageId: string; taskId: string } | null;
  onPendingNavHandled?: () => void;
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

  useEffect(() => {
    if (!pendingNav) return;
    setSelectedStageId(pendingNav.stageId);
    const task = currentRoadmap.stages
      .flatMap((stage) => stage.tasks)
      .find((t) => t.id === pendingNav.taskId);
    if (task) {
      setSelectedTask(task);
    } else {
      setSelectedTask(null);
    }
    if (onPendingNavHandled) {
      onPendingNavHandled();
    }
  }, [pendingNav, currentRoadmap.stages, onPendingNavHandled]);

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
  const overallCompleted = currentRoadmap.progress?.completed ?? 0;
  const overallTotal = currentRoadmap.progress?.total ?? 0;
  const upcomingAppointments = currentRoadmap.stages
    .flatMap((stage) =>
      stage.tasks
        .filter(
          (task) =>
            task.appointmentAt &&
            new Date(task.appointmentAt).getTime() > Date.now(),
        )
        .map((task) => ({
          stageId: stage.id,
          task,
          appointmentAt: task.appointmentAt as string,
        })),
    )
    .sort(
      (a, b) =>
        new Date(a.appointmentAt).getTime() -
        new Date(b.appointmentAt).getTime(),
    );

  const openAppointmentTask = (stageId: string, taskId: string) => {
    setSelectedStageId(stageId);
    const task = currentRoadmap.stages
      .flatMap((stage) => stage.tasks)
      .find((t) => t.id === taskId);
    if (task) {
      setSelectedTask(task);
    }
  };

  const handleOpenFirstAppointment = (stageId?: string) => {
    const stages = stageId
      ? currentRoadmap.stages.filter((stage) => stage.id === stageId)
      : currentRoadmap.stages;

    for (const stage of stages) {
      const nextTask = stage.tasks.find(
        (task) =>
          task.appointmentAt &&
          new Date(task.appointmentAt).getTime() > Date.now(),
      );
      if (nextTask) {
        openAppointmentTask(stage.id, nextTask.id);
        return;
      }
    }
  };

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
      ? selectedStage.tasks.filter((t) => t.assignedUser?.id === currentUserId)
      : (selectedStage?.tasks ?? []);

  return (
    <>
      <div className="space-y-4">
        <RoadmapBar
          stages={currentRoadmap.stages}
          selectedStageId={selectedStageId}
          onSelectStage={handleSelectStage}
          onOpenFirstAppointment={handleOpenFirstAppointment}
        />

        {!selectedStage && (
          <section className="rounded-lg border border-edge bg-surface-elevated px-4 py-3">
            <div className="flex items-center gap-3">
              <ProgressArc
                completed={overallCompleted}
                total={overallTotal}
                size={64}
                strokeWidth={6}
              />
              <div>
                <h2 className="text-base font-semibold text-content-primary">
                  {currentRoadmap.templateName}
                </h2>
                <p className="mt-0.5 text-sm text-content-muted">
                  {overallCompleted} of {overallTotal} tasks complete
                  {currentRoadmap.programLengthDays != null &&
                    ` · Day ${Math.max(
                      0,
                      Math.floor(
                        (Date.now() -
                          new Date(currentRoadmap.startDate).getTime()) /
                          86_400_000,
                      ),
                    )} / ${currentRoadmap.programLengthDays}`}
                  {` · Started ${new Date(
                    currentRoadmap.startDate,
                  ).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}`}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-2">
              <OverviewSummary
                roadmapId={currentRoadmap.id}
                summary={currentRoadmap.overviewSummary}
                readOnly={isArchived}
                onUpdated={refreshRoadmap}
              />
              <p className="text-sm text-content-muted">
                Select a stage to view tasks
              </p>
            </div>
          </section>
        )}

        {!selectedStage && upcomingAppointments.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-content-secondary">
              Upcoming appointments
            </h3>
            <StageDetailList
              tasks={upcomingAppointments.map((appt) => appt.task)}
              onSelectTask={handleSelectTask}
            />
          </div>
        )}

        {selectedStage && (
          <div className="mt-4 space-y-4">
            <button
              type="button"
              onClick={handleBackToOverview}
              className="text-base text-content-muted hover:text-content-secondary"
            >
              &larr; Overview
            </button>

            <section className="rounded-lg border border-edge bg-surface-elevated px-4 py-3">
              <div className="flex items-center gap-3">
                <ProgressArc
                  completed={selectedStage.progress.completed}
                  total={selectedStage.progress.total}
                  size={64}
                  strokeWidth={6}
                  color={stageArcColor}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-content-primary">
                      {selectedStage.title}
                    </h2>
                    {selectedStage.isBehind && (
                      <span className="rounded-full border border-status-error-border bg-status-error-bg px-2 py-0.5 text-[11px] font-medium text-status-error">
                        Behind schedule
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-content-muted">
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
        currentUserId={currentUserId}
      />
    </>
  );
}
