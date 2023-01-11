import { ModelOptions, prop, Severity } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

import { UserAvailabilityDayModel } from './user-availability-day.model';
import { UserModel } from '../../user/models/user.model';
import { DatabaseTablesEnum } from '../../common/enums/database-tables.enum';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: DatabaseTablesEnum.USER_AVAILABILITY,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class UserAvailabilityModel {
  @ApiProperty()
  @prop({
    type: [UserAvailabilityDayModel],
    required: true,
  })
  days: UserAvailabilityDayModel[];

  @prop({
    type: UserModel,
    ref: () => UserModel,
    required: true,
  })
  @ApiProperty()
  user: UserModel;
}
