import { ProgressArc } from './ProgressArc';

interface RoadmapGauge {
  templateName: string;
  daysInProgram: number;
  programLengthDays: number | null;
  progress: { completed: number; total: number };
}

function shortLabel(name: string): string {
  return name.replace(/ (Program|Access|Services)$/i, '');
}

export function ClientGauges({ roadmaps }: { roadmaps: RoadmapGauge[] }) {
  if (roadmaps.length === 0) return null;

  return (
    <div className="flex gap-4">
      {roadmaps.slice(0, 5).map((rm) => (
        <div
          key={rm.templateName}
          className="flex items-center gap-2"
        >
          <ProgressArc
            completed={rm.progress.completed}
            total={rm.progress.total}
            size={64}
            strokeWidth={6}
          />
          <div className="text-[11px] leading-tight text-content-muted">
            <div className="font-medium">{shortLabel(rm.templateName)}</div>
            <div>
              {rm.programLengthDays != null
                ? `Day ${rm.daysInProgram} / ${rm.programLengthDays}`
                : `Day ${rm.daysInProgram}`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
