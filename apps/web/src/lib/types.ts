export interface TaskVM {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
  status: string;
  color: 'green' | 'yellow' | 'red' | 'gray';
  isLocked: boolean;
  isOverdue: boolean;
  isNa: boolean;
  naReason: string | null;
  isRequired: boolean;
  dueDate: string | null;
  assignedUser: { id: string; name: string } | null;
  blockerType: string | null;
  blockerNote: string | null;
  dependsOnTaskId: string | null;
}

export interface StageVM {
  id: string;
  title: string;
  orderIndex: number;
  iconName: string;
  status: 'GREEN' | 'YELLOW' | 'RED' | 'GRAY';
  progress: { completed: number; total: number };
  redTaskCount: number;
  activatedAt: string | null;
  completedAt: string | null;
  handoffSummary: string | null;
  timelineLabel: string | null;
  recommendedDurationDays: number | null;
  tasks: TaskVM[];
}

export interface RoadmapVM {
  id: string;
  templateName: string;
  clientName: string;
  startDate: string;
  programLengthDays: number | null;
  isActive: boolean;
  stages: StageVM[];
}

export interface DemoUser {
  id: string;
  name: string;
}
