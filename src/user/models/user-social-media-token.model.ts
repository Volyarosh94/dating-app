import { prop } from '@typegoose/typegoose';
import { ApiProperty } from '@nestjs/swagger';

export class UserSocialMediaTokenModel {
  @prop({
    type: String,
    required: true,
  })
  @ApiProperty()
  socialMedia: string;

  @prop({
    type: String,
    required: false,
    default: '',
  })
  @ApiProperty()
  token: string;
}
