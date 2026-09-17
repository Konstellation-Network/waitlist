import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { JoinDto } from './dto/join.dto';
import { SurveyDto } from './dto/survey.dto';
import { clientCountry, clientIp, clientUserAgent } from './request-meta';
import { SurveyTokenGuard } from './survey-token.guard';
import type { SurveyRequest } from './survey-token.guard';
import { WaitlistService } from './waitlist.service';

@Controller('waitlist')
export class WaitlistController {
  private readonly appUrl: string;

  constructor(
    private readonly waitlist: WaitlistService,
    config: ConfigService,
  ) {
    this.appUrl = config.getOrThrow<string>('APP_URL').replace(/\/$/, '');
  }

  @Post('join')
  @HttpCode(200)
  join(@Body() dto: JoinDto, @Req() req: Request) {
    return this.waitlist.join(dto, {
      ip: clientIp(req),
      country: clientCountry(req),
      userAgent: clientUserAgent(req),
    });
  }

  @Post('survey')
  @HttpCode(200)
  @UseGuards(SurveyTokenGuard)
  survey(@Body() dto: SurveyDto, @Req() req: SurveyRequest) {
    return this.waitlist.completeSurvey(req.signupId, dto);
  }

  @Get('verify')
  @Redirect(undefined, 302)
  async verify(@Query('token') token?: string) {
    const result = await this.waitlist.verifyEmail(token);
    switch (result) {
      case 'ok':
        return { url: `${this.appUrl}/welcome` };
      case 'expired':
        return { url: `${this.appUrl}/?verify=expired` };
      default:
        return { url: `${this.appUrl}/?verify=invalid` };
    }
  }

  @Get('stats')
  stats() {
    return this.waitlist.stats();
  }
}
