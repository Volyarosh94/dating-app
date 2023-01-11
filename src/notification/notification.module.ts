import { Global, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

import { UserModel } from '../user/models/user.model';
import { NotificationService } from './notification.service';
import { notificationProviders } from './notification.providers';

@Global()
@Module({
  imports: [TypegooseModule.forFeature([UserModel])],
  providers: [...notificationProviders],
  exports: [NotificationService],
})
export class NotificationModule {}
