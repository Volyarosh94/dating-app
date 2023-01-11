import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SuccessMessageResponseDto {
  @IsString()
  @ApiProperty()
  success: boolean;
}
