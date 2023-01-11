import { prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

export class UserDetailModel {
  @prop({
    type: String,
    required: true,
  })
  @ApiProperty()
  label: string;

  @prop({
    type: String,
    required: false,
    default: '',
  })
  @ApiProperty()
  value: string;
}
