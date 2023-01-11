import { ModelOptions, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

import { UserModel } from '../../user/models/user.model';
import { DatabaseTablesEnum } from '../../common/enums/database-tables.enum';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: DatabaseTablesEnum.USER_OTP,
  },
})
export class UserOtpModel {
  @prop({
    type: UserModel,
    ref: () => UserModel,
    required: true,
  })
  @ApiProperty()
  userId: UserModel;

  @prop({
    type: Number,
    required: true,
  })
  @ApiProperty()
  otp: number;
}
