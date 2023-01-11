import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModel } from '../user/models/user.model';
import { UserOtpModel } from '../user-otp/models/user-otp.model';
import { UserSettingsModel } from '../user-settings/models/user-settings.model';
import { AuthTokenModel } from './models/authToken.model';
import { UserAvailabilityModel } from '../user-availability/models/user-availability.model';
import { authProviders } from './auth.providers';

@Module({
  imports: [
    TypegooseModule.forFeature([
      UserModel,
      UserOtpModel,
      UserAvailabilityModel,
      UserSettingsModel,
      AuthTokenModel,
    ]),
  ],
  controllers: [AuthController],
  providers: [...authProviders],
  exports: [AuthService],
})
export class AuthModule {}
