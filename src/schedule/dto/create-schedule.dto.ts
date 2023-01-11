import { IsMongoId, IsNotEmpty, IsOptional, ValidateIf } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

import { IsTime } from '../decorators/is-time.decorator';
import { transformScheduleTime } from '../transformers/schedule-time.transformer';
import { IsDateGreaterThanPresent } from '../decorators/is-date-greater-than-present';

export class CreateScheduleDto {
  @IsMongoId()
  @ApiProperty()
  userId: string;

  @IsDateGreaterThanPresent()
  @ApiProperty({
    example: '2022-05-30',
  })
  date: string;

  @IsNotEmpty()
  @IsTime()
  @Transform(({ value }) => transformScheduleTime(value))
  @ValidateIf((value) => !value.suggestions)
  @ApiProperty()
  time: string;

  @Type(() => String)
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsTime()
  suggestions: string[];
}
