import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UserNotificationsModel {
  @ApiProperty()
  @IsBoolean()
  newInvites: boolean;

  @ApiProperty()
  @IsBoolean()
  inComingCalls: boolean;

  @ApiProperty()
  @IsBoolean()
  missedCalls: boolean;

  @ApiProperty()
  @IsBoolean()
  updates: boolean;

  @ApiProperty()
  @IsBoolean()
  promotions: boolean;

  @ApiProperty()
  @IsBoolean()
  announcements: boolean;
}
