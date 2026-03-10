'use client';

import { StageVM } from '@/lib/types';
import { StageNode } from './StageNode';

export function RoadmapBar({
  stages,
  selectedStageId,
  onSelectStage,
  onOpenFirstAppointment,
  appointmentCounts,
}: {
  stages: StageVM[];
  selectedStageId: string | null;
  onSelectStage: (id: string) => void;
  onOpenFirstAppointment: (stageId?: string) => void;
  appointmentCounts: Record<string, number>;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2" data-testid="roadmap-bar">
      {stages.map((stage) => (
        <StageNode
          key={stage.id}
          stage={stage}
          selected={stage.id === selectedStageId}
          onSelect={() => onSelectStage(stage.id)}
          onOpenFirstAppointment={() => onOpenFirstAppointment(stage.id)}
          appointmentCount={appointmentCounts[stage.id] ?? 0}
        />
      ))}
    </div>
  );
}
