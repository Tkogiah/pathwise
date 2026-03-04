import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EvidenceSource, ExtractionStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { detectPii } from '../../lib/redaction';
import type { CreateExtractionDto } from './dto/create-extraction.dto';

@Injectable()
export class SlackService {
  constructor(private prisma: PrismaService) {}

  async createDraft(dto: CreateExtractionDto) {
    if (dto.notes) {
      const piiFound = detectPii(dto.notes);
      if (piiFound.length > 0) {
        throw new BadRequestException({
          message: 'PII detected in notes',
          categories: piiFound,
        });
      }
    }

    const program = await this.prisma.programTemplate.findUnique({
      where: { slug: dto.program_id },
    });
    if (!program) {
      throw new NotFoundException(`Program not found: ${dto.program_id}`);
    }

    const extraction = await this.prisma.$transaction(async (tx) => {
      const ext = await tx.extraction.create({
        data: {
          programId: program.id,
          clientRef: dto.client_ref,
          rawText: dto.notes ?? '',
          structuredPayload: dto as object,
          confidence: dto.confidence,
          requiresReview: dto.requires_review,
        },
      });

      await tx.evidence.createMany({
        data: dto.evidence.map((e) => ({
          extractionId: ext.id,
          source: EvidenceSource.SLACK,
          permalink: e.permalink,
          author: e.author,
          timestamp: new Date(e.timestamp),
        })),
      });

      return ext;
    });

    return { id: extraction.id };
  }

  async approve(id: string) {
    const extraction = await this.prisma.extraction.findUnique({
      where: { id },
    });
    if (!extraction) throw new NotFoundException('Extraction not found');
    if (extraction.status !== ExtractionStatus.PENDING) {
      throw new ConflictException(
        `Extraction is already ${extraction.status}`,
      );
    }

    const payload = extraction.structuredPayload as Record<string, unknown>;

    // Resolve client by full name match, scoped to clients enrolled in this program
    const clients = await this.prisma.client.findMany({
      where: {
        isArchived: false,
        programInstances: { some: { templateId: extraction.programId } },
      },
    });
    const normalized = extraction.clientRef.toLowerCase().replace(/_/g, ' ');
    const matches = clients.filter(
      (c) => `${c.firstName} ${c.lastName}`.toLowerCase() === normalized,
    );

    if (matches.length === 0) {
      throw new UnprocessableEntityException('client not resolved');
    }
    if (matches.length > 1) {
      throw new UnprocessableEntityException('ambiguous client ref');
    }
    const client = matches[0];

    // Resolve stageId (optional — non-blocking if unmatched)
    let stageId: string | null = null;
    if (typeof payload.stage === 'string') {
      const stage = await this.prisma.templateStage.findFirst({
        where: {
          templateId: extraction.programId,
          title: { equals: payload.stage, mode: 'insensitive' },
        },
      });
      stageId = stage?.id ?? null;
    }

    // Resolve taskId (optional — non-blocking if unmatched)
    let taskId: string | null = null;
    if (stageId && typeof payload.task === 'string') {
      const task = await this.prisma.templateTask.findFirst({
        where: {
          stageId,
          title: { equals: payload.task, mode: 'insensitive' },
        },
      });
      taskId = task?.id ?? null;
    }

    const fact = await this.prisma.$transaction(async (tx) => {
      const f = await tx.fact.create({
        data: {
          extractionId: extraction.id,
          clientId: client.id,
          stageId,
          taskId,
          statusValue: typeof payload.status === 'string' ? payload.status : null,
          notes: typeof payload.notes === 'string' ? payload.notes : null,
        },
      });

      await tx.extraction.update({
        where: { id },
        data: {
          status: ExtractionStatus.APPROVED,
          approvedAt: new Date(),
          clientId: client.id,
        },
      });

      return f;
    });

    return { factId: fact.id };
  }

  async reject(id: string) {
    const extraction = await this.prisma.extraction.findUnique({
      where: { id },
    });
    if (!extraction) throw new NotFoundException('Extraction not found');
    if (extraction.status !== ExtractionStatus.PENDING) {
      throw new ConflictException(
        `Extraction is already ${extraction.status}`,
      );
    }

    await this.prisma.extraction.update({
      where: { id },
      data: { status: ExtractionStatus.REJECTED, rejectedAt: new Date() },
    });

    return { id };
  }
}
