import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UserModel } from './models/user.model';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthTokenModel } from '../auth/models/authToken.model';
import { UserOtpModel } from '../user-otp/models/user-otp.model';
import { UserAvailabilityModel } from '../user-availability/models/user-availability.model';
import { userProviders } from './user.providers';
import { UserSettingsModel } from '../user-settings/models/user-settings.model';
import { UserOtpModule } from '../user-otp/user-otp.module';

@Module({
  imports: [
    TypegooseModule.forFeature([
      UserModel,
      UserOtpModel,
      UserSettingsModel,
      UserAvailabilityModel,
      AuthTokenModel,
      UserAvailabilityModel,
    ]),
    forwardRef(() => UserOtpModule),
  ],
  controllers: [UserController],
  providers: [...userProviders],
  exports: [UserService],
})
export class UserModule {}
