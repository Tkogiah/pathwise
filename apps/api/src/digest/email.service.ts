import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      this.resend = new Resend(apiKey);
    } else {
      this.resend = null;
      this.logger.warn('RESEND_API_KEY not set — email sending disabled.');
    }
    this.fromEmail = process.env.DIGEST_FROM_EMAIL ?? 'onboarding@resend.dev';
  }

  async sendDigestEmail(
    to: string,
    subject: string,
    body: string,
  ): Promise<{ success: boolean; error?: string }> {
    if (!this.resend) {
      return { success: false, error: 'No API key configured' };
    }

    try {
      await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        text: body,
      });
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, error: message };
    }
  }
}
