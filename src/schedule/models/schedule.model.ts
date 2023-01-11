import { ModelOptions, mongoose, prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '@typegoose/typegoose/lib/types';

import { UserModel } from '../../user/models/user.model';
import { ScheduleStatusEnum } from '../enums/schedule-status.enum';
import { ScheduleReviewEnum } from '../enums/schedule-review.enum';
import { DatabaseTablesEnum } from '../../common/enums/database-tables.enum';

@ModelOptions({
  schemaOptions: {
    timestamps: true,
    collection: DatabaseTablesEnum.SCHEDULE,
  },
})
export class ScheduleModel {
  @prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => UserModel,
    required: true,
  })
  @ApiProperty({
    type: UserModel,
  })
  creator: DocumentType<UserModel>;

  @prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: () => UserModel,
    required: true,
  })
  @ApiProperty({
    type: UserModel,
  })
  invited: DocumentType<UserModel>;

  @prop({
    type: String,
    enum: ScheduleStatusEnum,
    required: true,
    default: ScheduleStatusEnum.PENDING,
  })
  @ApiProperty()
  status: ScheduleStatusEnum;

  @prop({
    type: Date,
    required: true,
  })
  @ApiProperty()
  date: Date;

  @prop({
    type: String,
    required: false,
  })
  @ApiProperty({
    required: false,
  })
  time: string;

  @prop({
    type: [String],
    required: true,
    default: [],
  })
  @ApiProperty()
  suggestions: string[];

  @prop({
    type: String,
    enum: ScheduleReviewEnum,
    required: true,
    default: ScheduleReviewEnum.PENDING,
  })
  @ApiProperty()
  review: ScheduleReviewEnum;
}
