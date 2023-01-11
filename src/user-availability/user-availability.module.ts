import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UserAvailabilityModel } from './models/user-availability.model';
import { UserAvailabilityController } from './user-availability.controller';
import { UserAvailabilityService } from './user-availability.service';
import { AuthTokenModel } from '../auth/models/authToken.model';

@Module({
  imports: [
    TypegooseModule.forFeature([UserAvailabilityModel, AuthTokenModel]),
  ],
  controllers: [UserAvailabilityController],
  providers: [UserAvailabilityService],
  exports: [UserAvailabilityService],
})
export class UserAvailabilityModule {}
