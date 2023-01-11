import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
  @IsString()
  @ApiProperty()
  message: string;
}
