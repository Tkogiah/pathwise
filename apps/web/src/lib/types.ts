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
  dueNote: string | null;
  appointmentAt: string | null;
  appointmentNote: string | null;
}

export interface StageVM {
  id: string;
  title: string;
  orderIndex: number;
  iconName: string;
  status: 'GREEN' | 'YELLOW' | 'RED' | 'GRAY';
  isBehind: boolean;
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
  overviewSummary: string | null;
  isActive: boolean;
  stages: StageVM[];
  progress: { completed: number; total: number };
}

export interface DemoUser {
  id: string;
  name: string;
}

export type NoteLabel =
  | 'APPOINTMENT'
  | 'DOCUMENTS'
  | 'HOUSING_SEARCH'
  | 'VOUCHER'
  | 'BENEFITS'
  | 'OUTREACH'
  | 'ID_VERIFICATION'
  | 'BARRIER'
  | 'TASK_UPDATE'
  | 'OTHER';

export interface TaskNoteVM {
  id: string;
  taskInstanceId: string;
  authorId: string;
  authorName: string | null;
  label: NoteLabel;
  summary: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientNoteEntry {
  id: string;
  taskInstanceId: string;
  authorId: string;
  authorName: string | null;
  label: NoteLabel;
  summary: string | null;
  body: string;
  createdAt: string;
  updatedAt: string;
  taskTitle: string;
  stageTitle: string;
  roadmapId: string;
  stageId: string;
}
