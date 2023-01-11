import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserStatusEnum } from '../enums/user-status.enum';
import { SortUserByEnum } from '../enums/sort-user-by.enum';
import { SortOrderEnum } from '../../common/enums/sort-order.enum';

export class GetAllUsersQueryDto {
  @IsBoolean()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  online: boolean;

  @IsEnum({
    ONLY_SCHEDULE: UserStatusEnum.ONLY_SCHEDULE,
    READY_TO_CALL: UserStatusEnum.READY_TO_CALL,
  })
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  status: UserStatusEnum.ONLY_SCHEDULE | UserStatusEnum.READY_TO_CALL;

  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  name: string;

  @IsArray()
  @IsEnum(SortUserByEnum, { each: true })
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  sortBy: SortUserByEnum[];

  @IsEnum(SortOrderEnum)
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  sortOrder: SortOrderEnum;

  @IsNumber()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  radius: number;
}
