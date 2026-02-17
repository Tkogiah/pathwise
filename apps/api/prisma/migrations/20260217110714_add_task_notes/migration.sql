-- CreateEnum
CREATE TYPE "NoteLabel" AS ENUM ('APPOINTMENT', 'DOCUMENTS', 'HOUSING_SEARCH', 'VOUCHER', 'BENEFITS', 'OUTREACH', 'ID_VERIFICATION', 'BARRIER', 'TASK_UPDATE', 'OTHER');

-- CreateTable
CREATE TABLE "TaskNote" (
    "id" TEXT NOT NULL,
    "taskInstanceId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "label" "NoteLabel" NOT NULL DEFAULT 'OTHER',
    "summary" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaskNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TaskNote" ADD CONSTRAINT "TaskNote_taskInstanceId_fkey" FOREIGN KEY ("taskInstanceId") REFERENCES "TaskInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
