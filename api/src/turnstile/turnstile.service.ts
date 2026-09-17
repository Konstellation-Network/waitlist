import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface SiteVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

@Injectable()
export class TurnstileService {
  private readonly logger = new Logger(TurnstileService.name);
  private readonly secret: string;

  constructor(config: ConfigService) {
    this.secret = config.getOrThrow<string>('TURNSTILE_SECRET_KEY');
  }

  /** Returns true only when Cloudflare confirms the token. Network errors count as failure. */
  async verify(token: string, remoteIp: string | null): Promise<boolean> {
    const form = new URLSearchParams({ secret: this.secret, response: token });
    if (remoteIp) form.set('remoteip', remoteIp);

    try {
      const res = await fetch(SITEVERIFY_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: form,
        signal: AbortSignal.timeout(8_000),
      });
      if (!res.ok) {
        this.logger.warn(`siteverify HTTP ${res.status}`);
        return false;
      }
      const json = (await res.json()) as SiteVerifyResponse;
      if (!json.success) {
        this.logger.warn(
          `siteverify rejected: ${(json['error-codes'] ?? []).join(',')}`,
        );
      }
      return json.success === true;
    } catch (err) {
      this.logger.error(
        'siteverify request failed',
        err instanceof Error ? err.stack : String(err),
      );
      return false;
    }
  }
}
