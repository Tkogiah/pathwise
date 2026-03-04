-- CreateEnum
CREATE TYPE "ExtractionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "EvidenceSource" AS ENUM ('SLACK');

-- AlterTable: add nullable slug to ProgramTemplate
ALTER TABLE "ProgramTemplate" ADD COLUMN "slug" TEXT;

-- CreateIndex: unique slug
CREATE UNIQUE INDEX "ProgramTemplate_slug_key" ON "ProgramTemplate"("slug");

-- CreateTable: Extraction
CREATE TABLE "Extraction" (
    "id" TEXT NOT NULL,
    "programId" TEXT NOT NULL,
    "clientId" TEXT,
    "clientRef" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "structuredPayload" JSONB NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "status" "ExtractionStatus" NOT NULL DEFAULT 'PENDING',
    "requiresReview" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),

    CONSTRAINT "Extraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Evidence
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "extractionId" TEXT NOT NULL,
    "source" "EvidenceSource" NOT NULL DEFAULT 'SLACK',
    "permalink" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Fact
CREATE TABLE "Fact" (
    "id" TEXT NOT NULL,
    "extractionId" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "stageId" TEXT,
    "taskId" TEXT,
    "statusValue" TEXT,
    "notes" TEXT,
    "source" TEXT NOT NULL DEFAULT 'slack',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fact_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Extraction" ADD CONSTRAINT "Extraction_programId_fkey" FOREIGN KEY ("programId") REFERENCES "ProgramTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Extraction" ADD CONSTRAINT "Extraction_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_extractionId_fkey" FOREIGN KEY ("extractionId") REFERENCES "Extraction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fact" ADD CONSTRAINT "Fact_extractionId_fkey" FOREIGN KEY ("extractionId") REFERENCES "Extraction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fact" ADD CONSTRAINT "Fact_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fact" ADD CONSTRAINT "Fact_stageId_fkey" FOREIGN KEY ("stageId") REFERENCES "TemplateStage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fact" ADD CONSTRAINT "Fact_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "TemplateTask"("id") ON DELETE SET NULL ON UPDATE CASCADE;
