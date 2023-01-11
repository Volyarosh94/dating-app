import { IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;
}
