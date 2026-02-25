import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';

@Injectable()
export class DigestService {
  private readonly logger = new Logger(DigestService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  /** Runs daily at 07:00 UTC */
  @Cron('0 7 * * *')
  async handleCron() {
    this.logger.log('Running daily appointment digest…');
    const count = await this.generateAll();
    this.logger.log(`Generated ${count} digest(s).`);

    if (this.isEmailEnabled()) {
      const sent = await this.sendAll();
      this.logger.log(`Sent ${sent} digest email(s).`);
    }
  }

  /** Generate digests for all users. Returns number of digests upserted. */
  async generateAll(): Promise<number> {
    const users = await this.prisma.user.findMany({ select: { id: true } });
    let count = 0;
    for (const user of users) {
      const digest = await this.generateForUser(user.id);
      if (digest) count++;
    }
    return count;
  }

  /** Generate a digest for a single user. Returns the digest or null if no appointments. */
  async generateForUser(userId: string) {
    const dateKey = this.todayDateKey();
    const { start, end } = this.calendarDayWindow(dateKey);

    // Tasks assigned to this user OR unassigned (assignedUserId IS NULL)
    const tasks = await this.prisma.taskInstance.findMany({
      where: {
        appointmentAt: { gte: start, lt: end },
        status: { not: 'COMPLETE' },
        OR: [{ assignedUserId: userId }, { assignedUserId: null }],
      },
      include: {
        templateTask: { select: { title: true } },
        stageInstance: {
          include: {
            programInstance: {
              include: {
                client: { select: { firstName: true, lastName: true } },
              },
            },
          },
        },
      },
      orderBy: { appointmentAt: 'asc' },
    });

    if (tasks.length === 0) return null;

    const lines = tasks.map((t) => {
      const client = t.stageInstance.programInstance.client;
      const time = t.appointmentAt!.toISOString().slice(11, 16);
      const note = t.appointmentNote ? ` — ${t.appointmentNote}` : '';
      return `• ${time} ${client.firstName} ${client.lastName}: ${t.templateTask.title}${note}`;
    });

    const summary = `Appointments for ${dateKey}:\n${lines.join('\n')}`;

    return this.prisma.userDigest.upsert({
      where: { userId_dateKey: { userId, dateKey } },
      update: { summary },
      create: { userId, dateKey, summary },
    });
  }

  /** Send emails for today's unsent digests. Returns number of emails sent. */
  async sendAll(): Promise<number> {
    const dateKey = this.todayDateKey();

    const digests = await this.prisma.userDigest.findMany({
      where: { dateKey, emailedAt: null },
      include: { user: { select: { email: true, name: true } } },
    });

    let sent = 0;
    for (const digest of digests) {
      const subject = `Pathwise — ${digest.dateKey} Appointments`;
      const result = await this.emailService.sendDigestEmail(
        digest.user.email,
        subject,
        digest.summary,
      );

      if (result.success) {
        await this.prisma.userDigest.update({
          where: { id: digest.id },
          data: { emailedAt: new Date() },
        });
        sent++;
        this.logger.log(`Digest email sent to ${digest.user.email}`);
      } else {
        this.logger.warn(
          `Failed to send digest to ${digest.user.email}: ${result.error}`,
        );
      }
    }

    return sent;
  }

  /** Fetch digests for a user, optionally filtered by dateKey (YYYY-MM-DD). */
  async findByUser(userId: string, dateKey?: string) {
    return this.prisma.userDigest.findMany({
      where: dateKey ? { userId, dateKey } : { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /** Check both feature flag and API key before sending. */
  private isEmailEnabled(): boolean {
    const enabled = process.env.DIGEST_EMAIL_ENABLED === 'true';
    const hasKey = !!process.env.RESEND_API_KEY;
    if (!enabled || !hasKey) {
      this.logger.log(
        'Digest email skipped (DIGEST_EMAIL_ENABLED or RESEND_API_KEY not set).',
      );
      return false;
    }
    return true;
  }

  /** Returns today's date as YYYY-MM-DD in UTC */
  private todayDateKey(): string {
    return new Date().toISOString().slice(0, 10);
  }

  /** Returns start (00:00:00Z) and end (next day 00:00:00Z) for a YYYY-MM-DD date key */
  private calendarDayWindow(dateKey: string): { start: Date; end: Date } {
    const start = new Date(`${dateKey}T00:00:00Z`);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { start, end };
  }
}
