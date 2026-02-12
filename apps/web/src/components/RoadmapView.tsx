'use client';

import { useState, useEffect } from 'react';
import { RoadmapVM, TaskVM } from '@/lib/types';
import { RoadmapBar } from './RoadmapBar';
import { StageDetailList } from './StageDetailList';
import { TaskDrawer } from './TaskDrawer';

function getDefaultStageId(roadmap: RoadmapVM): string {
  const firstActivated = roadmap.stages.find((s) => s.activatedAt !== null);
  return firstActivated?.id ?? roadmap.stages[0].id;
}

export function RoadmapView({ roadmap }: { roadmap: RoadmapVM }) {
  const [selectedStageId, setSelectedStageId] = useState(() =>
    getDefaultStageId(roadmap),
  );
  const [selectedTask, setSelectedTask] = useState<TaskVM | null>(null);

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

  const handleSelectTask = (task: TaskVM) => {
    setSelectedTask(task);
  };

  const handleCloseDrawer = () => {
    setSelectedTask(null);
  };

  const selectedStage = roadmap.stages.find((s) => s.id === selectedStageId);

  return (
    <>
      <div>
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
                {selectedStage.progress.completed} of {selectedStage.progress.total}{' '}
                tasks complete
              </p>
            </section>

            <StageDetailList
              tasks={selectedStage.tasks}
              onSelectTask={handleSelectTask}
            />
          </div>
        )}
      </div>
      <TaskDrawer task={selectedTask} onClose={handleCloseDrawer} />
    </>
  );
}
