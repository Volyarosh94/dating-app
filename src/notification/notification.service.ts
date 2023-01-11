import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ClientProxy } from '@nestjs/microservices';

import { UserModel } from '../user/models/user.model';
import { NotificationTypeEnum } from './enums/notification-type.enum';
import { SendEmailNotificationDto } from './dto/send-email-notification.dto';
import { MicroservicesNameEnum } from '../common/enums/microservices-name.enum';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(UserModel) private userModel: ModelType<UserModel>,
    @Inject(MicroservicesNameEnum.MESSAGING)
    private messagingMicroservice: ClientProxy,
  ) {}

  async getUserNotificationSettings(userId: string) {
    const { settings, email } = await this.userModel
      .findOne({
        _id: userId,
      })
      .populate('settings');

    return {
      pushNotifications: settings.pushNotifications,
      emailNotifications: settings.emailNotifications,
      email,
    };
  }

  async sendPushNotification(
    userId: string,
    type: NotificationTypeEnum,
    data: { title: string } & Record<string, any>,
  ) {
    // const { pushNotifications } = await this.getUserNotificationSettings(
    //   userId,
    // );
    //
    // if (pushNotifications[type]) {
    //   await this.messagingMicroservice.connect();
    //
    //   await this.messagingMicroservice.emit('push-notification', data);
    // }
  }

  async sendEmailNotification(
    userId: string,
    type: NotificationTypeEnum,
    data: SendEmailNotificationDto,
  ) {
    // const { notificationMessage } = data;
    //
    // const { emailNotifications, email } =
    //   await this.getUserNotificationSettings(userId);
    //
    // if (emailNotifications[type] && email) {
    //   this.messagingMicroservice.emit('email-notification', {
    //     email,
    //     notificationMessage,
    //   });
    // }
  }
}
