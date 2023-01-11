import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { GenderEnum } from '../../common/enums/gender.enum';

export class UpdateUserInfoDto {
  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  firstName: string;

  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  lastName?: string;

  @IsEnum(GenderEnum)
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  gender: GenderEnum;

  @IsNumber()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  age: number;

  @IsEnum(GenderEnum)
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  interestedIn: GenderEnum;

  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  height: string;

  @IsPhoneNumber()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  phoneNumber: string;

  @IsEmail()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  email: string;
}
