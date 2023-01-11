import { IsEnum, IsString } from 'class-validator';
import { defaultUserSocialMediasNetworks } from '../../common/constants/default-user-social-media-tokens.constant';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserSocialMediaDto {
  @IsEnum(defaultUserSocialMediasNetworks)
  @ApiProperty()
  socialNetwork: string;

  @IsString()
  @ApiProperty()
  token: string;
}
