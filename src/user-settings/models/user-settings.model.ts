import { ModelOptions, prop, Severity } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

import { UserNotificationsModel } from './user-notifications.model';
import { DatabaseTablesEnum } from '../../common/enums/database-tables.enum';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: DatabaseTablesEnum.USER_SETTINGS,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class UserSettingsModel {
  @prop({
    type: Object,
    required: true,
  })
  @ApiProperty()
  pushNotifications: UserNotificationsModel;

  @prop({
    type: Object,
    required: true,
  })
  @ApiProperty()
  emailNotifications: UserNotificationsModel;
}
