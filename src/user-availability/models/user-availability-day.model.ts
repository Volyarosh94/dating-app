import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';

import { DaysEnum } from '../enums/days.enum';

export class UserAvailabilityDayModel {
  @ApiProperty()
  @prop({
    type: String,
    enum: DaysEnum,
    required: true,
  })
  label: DaysEnum;

  @ApiProperty()
  @prop({
    type: String,
    required: true,
  })
  from: string;

  @ApiProperty()
  @prop({
    type: String,
    required: true,
  })
  to: string;
}
