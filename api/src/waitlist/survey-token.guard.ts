import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { ERRORS } from '../constants/copy';

export interface SurveyTokenPayload {
  sub: string;
}

export interface SurveyRequest extends Request {
  signupId: string;
}

/** Validates `Authorization: Bearer <surveyToken>` and attaches `signupId` to the request. */
@Injectable()
export class SurveyTokenGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest<SurveyRequest>();
    const header = req.headers.authorization ?? '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(ERRORS.surveyUnauthorized);
    }
    try {
      const payload = await this.jwt.verifyAsync<SurveyTokenPayload>(token);
      if (typeof payload.sub !== 'string' || !payload.sub) {
        throw new Error('missing sub');
      }
      req.signupId = payload.sub;
      return true;
    } catch {
      throw new UnauthorizedException(ERRORS.surveyUnauthorized);
    }
  }
}
