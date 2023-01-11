import { IsLatitude, IsLongitude, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserLocationDto {
  @IsLatitude()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  lat: string;

  @IsLongitude()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  lng: string;

  @IsString()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  city: string;
}
