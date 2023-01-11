import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCallDto {
  @IsMongoId()
  @ApiProperty()
  scheduleId: string;
}
