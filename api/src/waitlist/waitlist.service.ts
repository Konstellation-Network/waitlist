import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHmac, randomBytes } from 'node:crypto';
import { Prisma } from '../../generated/prisma/client';
import { maskEmail } from '../common/mask-email';
import { ERRORS } from '../constants/copy';
import { DISPOSABLE_DOMAINS } from '../constants/disposable-domains';
import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import { TurnstileService } from '../turnstile/turnstile.service';
import { JoinDto, UTM_KEYS, Utm } from './dto/join.dto';
import { SurveyDto } from './dto/survey.dto';
import { SurveyTokenPayload } from './survey-token.guard';

const VERIFY_TOKEN_TTL_MS = 48 * 60 * 60 * 1000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const SURVEY_TOKEN_TTL = '30m';
const HEX_64 = /^[a-f0-9]{64}$/;

export interface JoinMeta {
  ip: string | null;
  country: string | null;
  userAgent: string | null;
}

export interface JoinResult {
  ok: true;
  surveyCompleted: false;
  surveyToken: string;
}

export type VerifyResult = 'ok' | 'expired' | 'invalid';

@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);
  private readonly jwtSecret: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly mail: MailService,
    private readonly turnstile: TurnstileService,
    config: ConfigService,
  ) {
    this.jwtSecret = config.getOrThrow<string>('JWT_SECRET');
  }

  // ---------------------------------------------------------------- join

  async join(dto: JoinDto, meta: JoinMeta): Promise<JoinResult> {
    const email = dto.email.trim().toLowerCase();
    const domain = email.split('@')[1] ?? '';
    if (!domain || DISPOSABLE_DOMAINS.has(domain)) {
      throw new BadRequestException(ERRORS.disposableEmail);
    }

    const human = await this.turnstile.verify(dto.turnstileToken, meta.ip);
    if (!human) {
      throw new BadRequestException(ERRORS.captchaFailed);
    }

    const ipHash = meta.ip ? this.hashIp(meta.ip) : null;
    if (ipHash) {
      await this.assertRateLimit(ipHash);
    }

    const verifyToken = randomBytes(32).toString('hex');
    const verifyTokenExpiresAt = new Date(Date.now() + VERIFY_TOKEN_TTL_MS);
    const utm = this.pickUtm(dto.utm);

    // Upsert on email. The update branch is deliberately empty (it only bumps
    // updatedAt) so an existing row's verified state is never touched here.
    const row = await this.prisma.signup.upsert({
      where: { email },
      create: {
        email,
        verifyToken,
        verifyTokenExpiresAt,
        source: utm?.utm_source ?? 'web',
        utm: utm ?? Prisma.DbNull,
        ipHash,
        country: meta.country,
        userAgent: meta.userAgent,
      },
      update: {},
      select: { id: true },
    });

    // Refresh the token only for unverified rows. Runs as a single query in
    // every case (new / existing unverified / existing verified) so the
    // response timing does not depend on the row's state.
    const { count } = await this.prisma.signup.updateMany({
      where: { id: row.id, emailVerifiedAt: null },
      data: { verifyToken, verifyTokenExpiresAt },
    });
    if (count > 0) {
      // Not awaited: MailService swallows its own errors.
      void this.mail.sendVerification(email, verifyToken);
    }
    this.logger.log(
      `join ${maskEmail(email)}: verification email ${
        count > 0 ? 'queued' : 'skipped (already verified)'
      }`,
    );

    await this.logEvent(row.id, 'signup', {
      source: utm?.utm_source ?? null,
    });

    const payload: SurveyTokenPayload = { sub: row.id };
    const surveyToken = await this.jwt.signAsync(payload, {
      expiresIn: SURVEY_TOKEN_TTL,
    });

    // Always false: the response must be byte-identical for a new address and
    // an existing one, so list membership cannot be probed.
    return { ok: true, surveyCompleted: false, surveyToken };
  }

  // -------------------------------------------------------------- survey

  /** Idempotent: a repeat submission overwrites the answers and never lowers the tier. */
  async completeSurvey(
    signupId: string,
    dto: SurveyDto,
  ): Promise<{ ok: true }> {
    const chainsUsed = Array.from(
      new Set(dto.chainsUsed.map((c) => c.trim()).filter((c) => c.length > 0)),
    ).slice(0, 8);
    const firstThing = dto.firstThing?.trim() || null;

    const existing = await this.prisma.signup.findUnique({
      where: { id: signupId },
      select: {
        priorityTier: true,
        emailVerifiedAt: true,
        surveyCompletedAt: true,
      },
    });
    if (!existing) {
      throw new UnauthorizedException(ERRORS.surveyUnauthorized);
    }

    const earnedTier = existing.emailVerifiedAt !== null ? 2 : 0;
    const priorityTier = Math.max(existing.priorityTier, earnedTier);
    const repeat = existing.surveyCompletedAt !== null;

    await this.prisma.signup.update({
      where: { id: signupId },
      data: {
        intent: dto.intent,
        chainsUsed,
        firstThing,
        surveyCompletedAt: existing.surveyCompletedAt ?? new Date(),
        priorityTier,
      },
      select: { id: true },
    });

    await this.logEvent(signupId, 'survey_completed', {
      intent: dto.intent,
      chains: chainsUsed.length,
      hasFirstThing: firstThing !== null,
      repeat,
    });

    return { ok: true };
  }

  // -------------------------------------------------------------- verify

  async verifyEmail(token: string | undefined): Promise<VerifyResult> {
    if (!token || !HEX_64.test(token)) return 'invalid';

    const existing = await this.prisma.signup.findUnique({
      where: { verifyToken: token },
      select: {
        id: true,
        email: true,
        verifyTokenExpiresAt: true,
        priorityTier: true,
        surveyCompletedAt: true,
      },
    });
    if (!existing) return 'invalid';
    if (
      !existing.verifyTokenExpiresAt ||
      existing.verifyTokenExpiresAt.getTime() < Date.now()
    ) {
      return 'expired';
    }

    const earnedTier = existing.surveyCompletedAt !== null ? 2 : 1;
    const priorityTier = Math.max(existing.priorityTier, earnedTier);

    // Token stays in the WHERE so two concurrent clicks cannot both "win".
    const { count } = await this.prisma.signup.updateMany({
      where: { id: existing.id, verifyToken: token },
      data: {
        emailVerifiedAt: new Date(),
        verifyToken: null,
        verifyTokenExpiresAt: null,
        status: 'verified',
        priorityTier,
      },
    });
    if (count === 0) return 'invalid';

    await this.logEvent(existing.id, 'email_verified');
    void this.mail.sendWelcome(existing.email);
    return 'ok';
  }

  // --------------------------------------------------------------- stats

  async stats(): Promise<{ verified: number }> {
    const verified = await this.prisma.signup.count({
      where: { status: 'verified' },
    });
    return { verified };
  }

  // ------------------------------------------------------------- helpers

  private hashIp(ip: string): string {
    return createHmac('sha256', this.jwtSecret)
      .update(ip)
      .digest('hex')
      .slice(0, 32);
  }

  private async assertRateLimit(ipHash: string): Promise<void> {
    const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
    const count = await this.prisma.signup.count({
      where: { ipHash, createdAt: { gt: since } },
    });
    if (count >= RATE_LIMIT_MAX) {
      this.logger.warn(`rate limit hit for ipHash ${ipHash}`);
      throw new HttpException(ERRORS.rateLimited, HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  private pickUtm(input: Utm | undefined): Record<string, string> | null {
    if (!input) return null;
    const out: Record<string, string> = {};
    for (const key of UTM_KEYS) {
      const v = input[key];
      if (typeof v === 'string' && v.trim()) out[key] = v.trim().slice(0, 200);
    }
    return Object.keys(out).length ? out : null;
  }

  private async logEvent(
    signupId: string,
    type: string,
    metadata?: Prisma.InputJsonObject,
  ): Promise<void> {
    try {
      await this.prisma.event.create({
        data: { signupId, type, metadata: metadata ?? Prisma.DbNull },
        select: { id: true },
      });
    } catch (err) {
      // Analytics must never fail the user's request.
      this.logger.error(
        `failed to log event ${type}`,
        err instanceof Error ? err.stack : String(err),
      );
    }
  }
}
