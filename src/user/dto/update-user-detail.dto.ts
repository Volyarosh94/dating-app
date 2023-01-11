import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { defaultDetailsLabels } from '../../common/constants/default-user-details.constant';

export class UpdateUserDetailDto {
  @IsEnum(defaultDetailsLabels)
  @ApiProperty()
  label: string;

  @IsString()
  @ApiProperty()
  value: string;
}
