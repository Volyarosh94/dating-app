import { forwardRef, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UserOtpModel } from './models/user-otp.model';
import { AuthTokenModel } from '../auth/models/authToken.model';
import { UserOtpController } from './user-otp.controller';
import { UserOtpService } from './user-otp.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypegooseModule.forFeature([UserOtpModel, AuthTokenModel]),
    forwardRef(() => UserModule),
  ],
  controllers: [UserOtpController],
  providers: [UserOtpService],
  exports: [UserOtpService],
})
export class UserOtpModule {}
