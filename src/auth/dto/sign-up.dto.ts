import { IsEmail, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @IsPhoneNumber()
  @ApiProperty()
  phoneNumber: string;

  @IsEmail()
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  email: string;
}
