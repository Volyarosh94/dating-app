import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ScheduleStatusEnum } from '../enums/schedule-status.enum';
import { ScheduleReviewEnum } from '../enums/schedule-review.enum';
import { SortScheduleByEnum } from '../enums/sort-schedule-by.enum';
import { SortOrderEnum } from '../../common/enums/sort-order.enum';

export class GetSchedulesDto {
  @IsBoolean()
  @Transform(({ value }) => JSON.parse(value))
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  created?: boolean;

  @IsEnum(ScheduleStatusEnum)
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  status?: ScheduleStatusEnum;

  @IsMongoId()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  userId?: string;

  @IsDateString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  from?: Date;

  @IsDateString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  to?: Date;

  @IsEnum(ScheduleReviewEnum)
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  review?: ScheduleReviewEnum;

  @IsEnum(SortScheduleByEnum, { each: true })
  @IsArray()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  sortBy?: SortScheduleByEnum[];

  @IsEnum(SortOrderEnum)
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  sortOrder?: SortOrderEnum;
}
