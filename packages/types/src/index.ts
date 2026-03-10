// --- Enums ---

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  BLOCKED = 'BLOCKED',
  COMPLETE = 'COMPLETE',
}

export enum StageStatus {
  GREEN = 'GREEN',
  YELLOW = 'YELLOW',
  RED = 'RED',
  GRAY = 'GRAY',
}

// --- Engine input types (plain objects, decoupled from Prisma) ---

export interface TaskInput {
  id: string;
  status: TaskStatus;
  isNa: boolean;
  isRequired: boolean;
  dueDate: Date | null;
  dependsOnTaskId: string | null;
}

export interface StageInput {
  id: string;
  orderIndex: number;
  activatedAt: Date | null;
  tasks: TaskInput[];
}

export interface StageProgress {
  completed: number;
  total: number;
}

export interface StageProgressInput {
  progress: StageProgress;
}