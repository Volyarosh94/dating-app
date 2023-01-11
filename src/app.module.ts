import { Module } from '@nestjs/common';
import { TwilioModule } from 'nestjs-twilio';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from './schedule/schedule.module';
import { UserSettingsModule } from './user-settings/user-settings.module';
import { UserAvailabilityModule } from './user-availability/user-availability.module';
import { NotificationModule } from './notification/notification.module';
import { CallModule } from './call/call.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypegooseModule.forRoot(process.env.DATABASE_URL),
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
    CommonModule,
    NotificationModule,
    UserModule,
    UserSettingsModule,
    AuthModule,
    ScheduleModule,
    UserAvailabilityModule,
    CallModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
