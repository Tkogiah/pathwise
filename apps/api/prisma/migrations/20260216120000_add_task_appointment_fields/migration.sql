-- AlterTable
ALTER TABLE "TaskInstance"
ADD COLUMN     "dueNote" TEXT,
ADD COLUMN     "appointmentAt" TIMESTAMP(3),
ADD COLUMN     "appointmentNote" TEXT;
