import { IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCallDto {
  @IsBoolean()
  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  missed: boolean;

  @IsBoolean()
  @ApiProperty({
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  finished: boolean;
}
