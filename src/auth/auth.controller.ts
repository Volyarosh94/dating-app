import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SuccessMessageResponseDto } from '../common/dto/success-message-response.dto';
import { User } from '../user/decorators/user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { MessageResponseDto } from '../common/dto/message-response.dto';

@Controller('/auth')
@ApiTags('Auth')
@ApiBadRequestResponse({ description: 'Bad request' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  @ApiCreatedResponse({
    type: MessageResponseDto,
  })
  @ApiOperation({
    summary: 'Sign up',
  })
  signUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @Post('/login')
  @ApiCreatedResponse({
    type: MessageResponseDto,
  })
  @ApiOperation({
    summary: 'Login',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('/logout')
  @UseGuards(AuthGuard)
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiCreatedResponse({
    type: SuccessMessageResponseDto,
  })
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Logout',
  })
  logout(@User('authTokenId') authTokenId: string) {
    return this.authService.logout(authTokenId);
  }
}
