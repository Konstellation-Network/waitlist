import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { VERIFICATION_EMAIL, WELCOME_EMAIL } from '../constants/copy';

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key: string) => vars[key] ?? '',
  );
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly from: string;
  private readonly appUrl: string;
  private readonly apiUrl: string;

  constructor(config: ConfigService) {
    this.resend = new Resend(config.getOrThrow<string>('RESEND_API_KEY'));
    this.from = config.getOrThrow<string>('EMAIL_FROM');
    this.appUrl = config.getOrThrow<string>('APP_URL');
    this.apiUrl = config.getOrThrow<string>('API_URL');
  }

  /** Never throws — a Resend failure must not fail the calling request. */
  async sendVerification(to: string, token: string): Promise<void> {
    const verifyUrl = `${this.apiUrl}/waitlist/verify?token=${encodeURIComponent(token)}`;
    await this.send(
      to,
      VERIFICATION_EMAIL.subject,
      fill(VERIFICATION_EMAIL.body, {
        verifyUrl,
        appUrl: this.appUrl,
      }),
    );
  }

  /** Never throws. */
  async sendWelcome(to: string): Promise<void> {
    await this.send(
      to,
      WELCOME_EMAIL.subject,
      fill(WELCOME_EMAIL.body, {
        appUrl: this.appUrl,
      }),
    );
  }

  private async send(to: string, subject: string, text: string): Promise<void> {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.from,
        to,
        subject,
        text,
      });
      if (error) {
        this.logger.error(
          `Resend error sending "${subject}": ${error.name} – ${error.message}`,
        );
        return;
      }
      this.logger.log(`Sent "${subject}" (id ${data?.id ?? 'unknown'})`);
    } catch (err) {
      this.logger.error(
        `Failed to send "${subject}"`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }
}
