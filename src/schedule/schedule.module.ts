import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { ScheduleModel } from './models/schedule.model';
import { ScheduleController } from './schedule.controller';
import { UserModel } from '../user/models/user.model';
import { AuthTokenModel } from '../auth/models/authToken.model';
import { UserOtpModel } from '../user-otp/models/user-otp.model';
import { UserAvailabilityModel } from '../user-availability/models/user-availability.model';
import { scheduleProviders } from './schedule.providers';
import { UserSettingsModel } from '../user-settings/models/user-settings.model';

@Module({
  imports: [
    TypegooseModule.forFeature([
      ScheduleModel,
      UserOtpModel,
      UserModel,
      AuthTokenModel,
      UserAvailabilityModel,
      UserSettingsModel,
    ]),
  ],
  controllers: [ScheduleController],
  providers: [...scheduleProviders],
})
export class ScheduleModule {}
