import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CallParamsDto {
  @IsMongoId()
  @ApiProperty()
  callId: string;
}
