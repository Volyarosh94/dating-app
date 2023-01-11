import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { CallModel } from './models/call.model';
import { CallController } from './call.controller';
import { AuthTokenModel } from '../auth/models/authToken.model';
import { ScheduleModel } from '../schedule/models/schedule.model';
import { UserModel } from '../user/models/user.model';
import { UserOtpModel } from '../user-otp/models/user-otp.model';
import { UserSettingsModel } from '../user-settings/models/user-settings.model';
import { UserAvailabilityModel } from '../user-availability/models/user-availability.model';
import { callProviders } from './call.providers';

@Module({
  imports: [
    TypegooseModule.forFeature([
      CallModel,
      AuthTokenModel,
      ScheduleModel,
      UserModel,
      UserOtpModel,
      UserSettingsModel,
      UserAvailabilityModel,
    ]),
  ],
  controllers: [CallController],
  providers: [...callProviders],
})
export class CallModule {}
