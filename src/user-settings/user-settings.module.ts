import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UserSettingsModel } from './models/user-settings.model';
import { UserSettingsController } from './user-settings.controller';
import { UserSettingsService } from './user-settings.service';
import { AuthTokenModel } from '../auth/models/authToken.model';

@Module({
  imports: [TypegooseModule.forFeature([UserSettingsModel, AuthTokenModel])],
  controllers: [UserSettingsController],
  providers: [UserSettingsService],
  exports: [UserSettingsService],
})
export class UserSettingsModule {}
