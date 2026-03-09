import { PrismaClient } from '@prisma/client';
import {
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { SlackService } from '../../src/integrations/slack/slack.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import fixture from '../fixtures/slack_event.json';

/**
 * Integration tests for SlackService.
 * Tests business logic directly against a live database.
 * Requires DATABASE_URL and a running Postgres instance.
 */

let service: SlackService;
let prisma: PrismaClient;
let programId: string;
let clientId: string;

beforeAll(async () => {
  prisma = new PrismaClient();
  const ps = new PrismaService();
  await ps.onModuleInit();
  service = new SlackService(ps);

  const program = await prisma.programTemplate.upsert({
    where: { slug: 'housing' },
    create: { name: 'Housing Program (Test)', slug: 'housing' },
    update: {},
  });
  programId = program.id;

  // Pre-cleanup: remove stale data from any prior failed test runs
  await prisma.fact.deleteMany({ where: { extraction: { programId } } });
  await prisma.evidence.deleteMany({ where: { extraction: { programId } } });
  await prisma.extraction.deleteMany({ where: { programId } });
  const staleClients = await prisma.client.findMany({
    where: { firstName: 'Frank', lastName: 'Santos' },
  });
  for (const c of staleClients) {
    await prisma.clientProgramInstance.deleteMany({ where: { clientId: c.id } });
    await prisma.client.delete({ where: { id: c.id } });
  }

  const client = await prisma.client.create({
    data: { firstName: 'Frank', lastName: 'Santos' },
  });
  clientId = client.id;

  // Enroll Frank in the housing program so the program-scoped client resolution finds him
  await prisma.clientProgramInstance.create({
    data: { clientId, templateId: programId, startDate: new Date() },
  });
});

afterAll(async () => {
  // Delete facts via the extraction relation to catch any leftover data from prior runs
  await prisma.fact.deleteMany({ where: { extraction: { programId } } });
  await prisma.evidence.deleteMany({
    where: { extraction: { programId } },
  });
  await prisma.extraction.deleteMany({ where: { programId } });
  await prisma.clientProgramInstance.deleteMany({ where: { clientId } });
  await prisma.client.delete({ where: { id: clientId } });
  await prisma.programTemplate
    .delete({ where: { id: programId, name: 'Housing Program (Test)' } })
    .catch(() => undefined);
  await prisma.$disconnect();
});

describe('SlackService.createDraft', () => {
  it('creates PENDING extraction + evidence with valid payload', async () => {
    const result = await service.createDraft(
      fixture as Parameters<typeof service.createDraft>[0],
    );

    expect(result).toHaveProperty('id');

    const extraction = await prisma.extraction.findUnique({
      where: { id: result.id },
      include: { evidence: true },
    });
    expect(extraction?.status).toBe('PENDING');
    expect(extraction?.evidence).toHaveLength(1);
  });

  it('throws 400 when notes contain PII', async () => {
    await expect(
      service.createDraft({
        ...(fixture as Parameters<typeof service.createDraft>[0]),
        notes: 'SSN: 123-45-6789',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws 404 for unknown program_id', async () => {
    await expect(
      service.createDraft({
        ...(fixture as Parameters<typeof service.createDraft>[0]),
        program_id: 'nonexistent',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('SlackService.approve', () => {
  it('approves extraction: creates fact, resolves clientId', async () => {
    const { id } = await service.createDraft(
      fixture as Parameters<typeof service.createDraft>[0],
    );
    const approveResult = await service.approve(id);

    expect(approveResult).toHaveProperty('factId');

    const extraction = await prisma.extraction.findUnique({ where: { id } });
    expect(extraction?.status).toBe('APPROVED');
    expect(extraction?.approvedAt).not.toBeNull();
    expect(extraction?.clientId).toBe(clientId);

    const fact = await prisma.fact.findUnique({
      where: { id: approveResult.factId },
    });
    expect(fact?.clientId).toBe(clientId);
  });

  it('throws 409 when approving an already-approved extraction', async () => {
    const { id } = await service.createDraft(
      fixture as Parameters<typeof service.createDraft>[0],
    );
    await service.approve(id);

    await expect(service.approve(id)).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws 422 when clientRef cannot be resolved', async () => {
    const { id } = await service.createDraft({
      ...(fixture as Parameters<typeof service.createDraft>[0]),
      client_ref: 'unknown_person',
    });

    await expect(service.approve(id)).rejects.toBeInstanceOf(
      UnprocessableEntityException,
    );
  });

  it('throws 404 for unknown extraction id', async () => {
    await expect(service.approve('nonexistent-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

describe('SlackService.reject', () => {
  it('rejects extraction: status REJECTED, no fact created', async () => {
    const { id } = await service.createDraft(
      fixture as Parameters<typeof service.createDraft>[0],
    );
    await service.reject(id);

    const extraction = await prisma.extraction.findUnique({ where: { id } });
    expect(extraction?.status).toBe('REJECTED');
    expect(extraction?.rejectedAt).not.toBeNull();

    const facts = await prisma.fact.findMany({ where: { extractionId: id } });
    expect(facts).toHaveLength(0);
  });

  it('throws 409 when rejecting an already-rejected extraction', async () => {
    const { id } = await service.createDraft(
      fixture as Parameters<typeof service.createDraft>[0],
    );
    await service.reject(id);

    await expect(service.reject(id)).rejects.toBeInstanceOf(ConflictException);
  });

  it('throws 404 for unknown extraction id', async () => {
    await expect(service.reject('nonexistent-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
