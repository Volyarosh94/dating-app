import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserNotificationsModel } from '../models/user-notifications.model';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateNotificationsDto {
  @IsObject()
  @Type(() => UserNotificationsModel)
  @ValidateNested()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  pushNotifications?: UserNotificationsModel;

  @IsObject()
  @Type(() => UserNotificationsModel)
  @ValidateNested()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  emailNotifications?: UserNotificationsModel;
}
