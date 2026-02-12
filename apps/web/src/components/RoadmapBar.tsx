'use client';

import { StageVM } from '@/lib/types';
import { StageNode } from './StageNode';

export function RoadmapBar({
  stages,
  selectedStageId,
  onSelectStage,
}: {
  stages: StageVM[];
  selectedStageId: string;
  onSelectStage: (id: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {stages.map((stage) => (
        <StageNode
          key={stage.id}
          stage={stage}
          selected={stage.id === selectedStageId}
          onSelect={() => onSelectStage(stage.id)}
        />
      ))}
    </div>
  );
}
