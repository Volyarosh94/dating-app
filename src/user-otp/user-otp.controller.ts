import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthTokenModel } from '../auth/models/authToken.model';
import { UserOtpService } from './user-otp.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Controller('/user-otp')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiTags('User otp')
@ApiBearerAuth()
export class UserOtpController {
  constructor(private userOtpService: UserOtpService) {}

  @Post('/verify')
  @ApiCreatedResponse({
    type: AuthTokenModel,
  })
  @ApiOperation({
    summary: 'Verify user otp after login',
  })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.userOtpService.verifyOtp(dto);
  }
}
