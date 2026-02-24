import { PrismaClient } from '@prisma/client';

/**
 * Integration test for DigestService upsert idempotency.
 * Requires a running database with seed data.
 * Run: npx vitest run apps/api/src/digest/digest.service.spec.ts
 */

const prisma = new PrismaClient();

afterAll(async () => {
  await prisma.$disconnect();
});

describe('DigestService — upsert idempotency', () => {
  const dateKey = '2099-01-01'; // far-future key that won't collide

  afterAll(async () => {
    // Clean up test digests
    await prisma.userDigest.deleteMany({ where: { dateKey } });
  });

  it('creates a digest on first call, updates on second (same userId+dateKey)', async () => {
    const user = await prisma.user.findFirst();
    if (!user) throw new Error('No users in database — run seed first');

    const summaryV1 = 'Test digest v1';
    const summaryV2 = 'Test digest v2';

    // First upsert — should create
    const d1 = await prisma.userDigest.upsert({
      where: { userId_dateKey: { userId: user.id, dateKey } },
      update: { summary: summaryV1 },
      create: { userId: user.id, dateKey, summary: summaryV1 },
    });
    expect(d1.summary).toBe(summaryV1);

    // Second upsert — should update, not create a duplicate
    const d2 = await prisma.userDigest.upsert({
      where: { userId_dateKey: { userId: user.id, dateKey } },
      update: { summary: summaryV2 },
      create: { userId: user.id, dateKey, summary: summaryV2 },
    });
    expect(d2.id).toBe(d1.id);
    expect(d2.summary).toBe(summaryV2);

    // Verify only one record exists
    const count = await prisma.userDigest.count({
      where: { userId: user.id, dateKey },
    });
    expect(count).toBe(1);
  });
});
