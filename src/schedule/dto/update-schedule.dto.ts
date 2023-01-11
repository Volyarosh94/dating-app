import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { ScheduleStatusEnum } from '../enums/schedule-status.enum';
import { IsTime } from '../decorators/is-time.decorator';
import { ScheduleReviewEnum } from '../enums/schedule-review.enum';

export class UpdateScheduleDto {
  @IsEnum(ScheduleStatusEnum)
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  status: ScheduleStatusEnum;

  @IsTime()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  time: string;

  @IsEnum(ScheduleReviewEnum)
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  review: ScheduleReviewEnum;
}
