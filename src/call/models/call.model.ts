import { ModelOptions, prop } from '@typegoose/typegoose';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

import { ScheduleModel } from '../../schedule/models/schedule.model';
import { UserModel } from '../../user/models/user.model';
import { DatabaseTablesEnum } from '../../common/enums/database-tables.enum';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: DatabaseTablesEnum.USER_CALL,
  },
})
export class CallModel {
  @prop({
    type: Boolean,
    required: true,
    default: false,
  })
  @ApiProperty()
  finished: boolean;

  @prop({
    type: Boolean,
    required: true,
    default: false,
  })
  @ApiProperty()
  missed: boolean;

  @prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => ScheduleModel,
    required: true,
  })
  @ApiProperty({ type: ScheduleModel })
  schedule: DocumentType<ScheduleModel>;

  @prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => UserModel,
    required: true,
  })
  @ApiProperty({ type: UserModel })
  initiator: DocumentType<UserModel>;
}
