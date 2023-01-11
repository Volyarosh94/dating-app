import { IsBoolean, IsMongoId, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetCallsQueryDto {
  @IsBoolean()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  missed?: boolean;

  @IsBoolean()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  finished?: boolean;

  @IsMongoId()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  userId?: string;
}
