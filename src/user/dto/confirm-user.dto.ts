import { IsNumber, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmUserDto {
  @IsNumber()
  @ApiProperty()
  otp: number;

  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;
}
