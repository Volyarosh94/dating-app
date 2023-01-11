import { NotificationService } from './notification.service';
import { MicroservicesNameEnum } from '../common/enums/microservices-name.enum';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

export const notificationProviders = [
  NotificationService,
  {
    provide: MicroservicesNameEnum.MESSAGING,
    useFactory: () =>
      ClientProxyFactory.create({
        transport: Transport.TCP,
        options: {
          host: process.env.NOTIFICATION_MICROSERVICE_HOST,
          port: 3000,
        },
      }),
  },
];
