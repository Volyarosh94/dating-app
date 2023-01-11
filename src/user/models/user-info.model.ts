import { ApiProperty } from '@nestjs/swagger';

import { GenderEnum } from '../../common/enums/gender.enum';

export class UserInfo {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName?: string;

  @ApiProperty()
  gender: GenderEnum;

  @ApiProperty()
  interestedIn: GenderEnum;

  @ApiProperty()
  age: number;

  @ApiProperty()
  mainPhoto: string;

  @ApiProperty()
  secondaryPhoto: string;

  @ApiProperty()
  height: string;
}
