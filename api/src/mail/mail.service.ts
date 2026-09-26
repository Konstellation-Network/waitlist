import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { maskEmail } from '../common/mask-email';
import { VERIFICATION_EMAIL, WELCOME_EMAIL } from '../constants/copy';

const SEND_TIMEOUT_MS = 10_000;

function fill(template: string, vars: Record<string, string>): string {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (_, key: string) => vars[key] ?? '',
  );
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly endpoint: string;
  private readonly authHeader: string;
  private readonly from: string;
  private readonly appUrl: string;
  private readonly apiUrl: string;

  constructor(config: ConfigService) {
    const apiKey = config.getOrThrow<string>('MAILGUN_API_KEY');
    const domain = config.getOrThrow<string>('MAILGUN_DOMAIN');
    const baseUrl = config
      .getOrThrow<string>('MAILGUN_API_URL')
      .replace(/\/$/, '');
    this.endpoint = `${baseUrl}/v3/${domain}/messages`;
    this.authHeader = `Basic ${Buffer.from(`api:${apiKey}`).toString('base64')}`;
    this.from = config.getOrThrow<string>('EMAIL_FROM');
    this.appUrl = config.getOrThrow<string>('APP_URL');
    this.apiUrl = config.getOrThrow<string>('API_URL');
  }

  /** Never throws — a mail failure must not fail the calling request. */
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
    const body = new URLSearchParams({ from: this.from, to, subject, text });
    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          authorization: this.authHeader,
          'content-type': 'application/x-www-form-urlencoded',
        },
        body,
        signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
      });

      if (!res.ok) {
        const detail = (await res.text()).slice(0, 500);
        this.logger.error(
          `Mailgun ${res.status} sending "${subject}" to ${maskEmail(to)}: ${detail}`,
        );
        return;
      }

      const json = (await res.json().catch(() => null)) as {
        id?: string;
      } | null;
      this.logger.log(
        `Sent "${subject}" to ${maskEmail(to)} (id ${json?.id ?? 'unknown'})`,
      );
    } catch (err) {
      this.logger.error(
        `Failed to send "${subject}" to ${maskEmail(to)}`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }
}
