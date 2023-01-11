import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DaysEnum } from '../enums/days.enum';
import { IsTime } from '../../schedule/decorators/is-time.decorator';

export class UpdateAvailabilityDto {
  @IsEnum(DaysEnum)
  @ApiProperty()
  day: DaysEnum;

  @IsTime()
  @ApiProperty()
  from: string;

  @IsTime()
  @ApiProperty()
  to: string;
}
