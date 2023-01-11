import { ModelOptions, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

import { UserModel } from '../../user/models/user.model';
import { DatabaseTablesEnum } from '../../common/enums/database-tables.enum';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: DatabaseTablesEnum.AUTH_TOKEN,
  },
})
export class AuthTokenModel {
  @prop({
    type: String,
    required: true,
  })
  @ApiProperty()
  token: string;

  @prop({
    type: UserModel,
    ref: () => UserModel,
    autopopulate: true,
  })
  @ApiProperty()
  user: UserModel;
}
