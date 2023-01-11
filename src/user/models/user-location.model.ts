import { ApiProperty } from '@nestjs/swagger';
import { prop } from '@typegoose/typegoose';

export class UserLocation {
  @ApiProperty()
  @prop({
    type: String,
    required: false,
  })
  lat: string;

  @ApiProperty()
  @prop({
    type: String,
    required: false,
  })
  lng: string;

  @ApiProperty()
  @prop({
    type: String,
    required: false,
  })
  city: string;
}
