import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';
import { ERRORS } from '../constants/copy';

/** Compares the `x-admin-key` header to ADMIN_KEY in constant time. */
@Injectable()
export class AdminKeyGuard implements CanActivate {
  private readonly expected: Buffer;

  constructor(config: ConfigService) {
    this.expected = createHash('sha256')
      .update(config.getOrThrow<string>('ADMIN_KEY'))
      .digest();
  }

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const header = req.headers['x-admin-key'];
    const provided = Array.isArray(header) ? header[0] : header;
    if (!provided) throw new UnauthorizedException(ERRORS.adminUnauthorized);

    // Hash both sides so timingSafeEqual always compares equal-length buffers.
    const actual = createHash('sha256').update(provided).digest();
    if (!timingSafeEqual(actual, this.expected)) {
      throw new UnauthorizedException(ERRORS.adminUnauthorized);
    }
    return true;
  }
}
