import { IsMongoId } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserParamsDto {
  @IsMongoId()
  @ApiProperty()
  userId: string;
}
