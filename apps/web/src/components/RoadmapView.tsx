'use client';

import { useState } from 'react';
import { RoadmapVM } from '@/lib/types';
import { RoadmapBar } from './RoadmapBar';
import { StageDetailList } from './StageDetailList';

function getDefaultStageId(roadmap: RoadmapVM): string {
  const firstActivated = roadmap.stages.find((s) => s.activatedAt !== null);
  return firstActivated?.id ?? roadmap.stages[0].id;
}

export function RoadmapView({ roadmap }: { roadmap: RoadmapVM }) {
  const [selectedStageId, setSelectedStageId] = useState(() =>
    getDefaultStageId(roadmap),
  );

  const selectedStage = roadmap.stages.find((s) => s.id === selectedStageId);

  return (
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

          <StageDetailList tasks={selectedStage.tasks} />
        </div>
      )}
    </div>
  );
}
