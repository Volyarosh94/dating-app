import { IsNumber, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;

  @IsNumber()
  @ApiProperty()
  otp: number;
}
