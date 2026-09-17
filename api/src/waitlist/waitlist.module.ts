import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from '../admin/admin.controller';
import { AdminKeyGuard } from '../admin/admin-key.guard';
import { AdminService } from '../admin/admin.service';
import { MailModule } from '../mail/mail.module';
import { TurnstileModule } from '../turnstile/turnstile.module';
import { SurveyTokenGuard } from './survey-token.guard';
import { WaitlistController } from './waitlist.controller';
import { WaitlistService } from './waitlist.service';

@Module({
  imports: [
    MailModule,
    TurnstileModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [WaitlistController, AdminController],
  providers: [WaitlistService, SurveyTokenGuard, AdminService, AdminKeyGuard],
})
export class WaitlistModule {}
