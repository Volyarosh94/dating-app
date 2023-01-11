import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { UserModel } from './models/user.model';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from './decorators/user.decorator';
import { UpdateUserLocationDto } from './dto/update-user-location.dto';
import { SuccessMessageResponseDto } from '../common/dto/success-message-response.dto';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { GetAllUsersQueryDto } from './dto/get-all-users-query.dto';
import { ConfirmUserDto } from './dto/confirm-user.dto';
import { IUserOverview } from './interfaces/user-overview.interface';
import { UserParamsDto } from './dto/user-params.dto';
import { UpdateUserDetailDto } from './dto/update-user-detail.dto';
import { UpdateUserSocialMediaDto } from './dto/update-user-social-media.dto';
import { AuthTokenModel } from '../auth/models/authToken.model';

@Controller('/user')
@ApiTags('User')
@ApiBadRequestResponse({ description: 'Bad request' })
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @ApiOkResponse({
    type: UserModel,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get me',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getUser(@User() user: UserModel) {
    return user;
  }

  @Post('/delete')
  @ApiOkResponse({
    type: SuccessMessageResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Delete account',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  deleteUserAccount(@User('_id') userId: string) {
    return this.userService.deleteUserAccount(userId);
  }

  @Patch('/info')
  @ApiOkResponse({
    type: SuccessMessageResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update user info',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  updateUserInfo(@Body() dto: UpdateUserInfoDto, @User('_id') userId: string) {
    return this.userService.updateUserInfo(userId, dto);
  }

  @Patch('/location')
  @ApiOkResponse({
    type: SuccessMessageResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update user location',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  updateUserLocation(
    @Body() dto: UpdateUserLocationDto,
    @User('_id') userId: string,
  ) {
    return this.userService.updateUserLocation(userId, dto);
  }

  @Patch('/social-media')
  @ApiOkResponse({
    type: SuccessMessageResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update user location',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  updateUserSocialMedia(
    @User('_id') userId: string,
    @Body() dto: UpdateUserSocialMediaDto,
  ) {
    return this.userService.updateUserSocialMedia(userId, dto);
  }

  @Post('/upload-main-photo')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiCreatedResponse({
    type: UserModel,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Upload user main photo',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  uploadMainPhoto(
    @UploadedFile() photo: Express.Multer.File,
    @User('_id') userId: string,
  ) {
    return this.userService.uploadMainPhoto(userId, photo);
  }

  @Post('/upload-secondary-photo')
  @UseInterceptors(FileInterceptor('photo'))
  @ApiCreatedResponse({
    type: UserModel,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Upload user secondary photo',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  uploadSecondaryPhoto(
    @UploadedFile() photo: Express.Multer.File,
    @User('_id') userId: string,
  ) {
    return this.userService.uploadSecondaryPhoto(userId, photo);
  }

  @Patch('/detail')
  @ApiOkResponse({
    type: SuccessMessageResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update user details',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  updateUserDetail(
    @User('_id') userId: string,
    @Body() dto: UpdateUserDetailDto,
  ) {
    return this.userService.updateUserDetail(userId, dto);
  }

  @Patch('/switch-status')
  @ApiOkResponse({
    type: SuccessMessageResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Update user status',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  switchUserStatus(@User() user: DocumentType<UserModel>) {
    return this.userService.switchUserStatus(user._id, user.online);
  }

  @Get('/users')
  @ApiOkResponse({
    type: [UserModel],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get users by filters',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getAvailableUsers(
    @User('_id') userId: string,
    @Body() dto: GetAllUsersQueryDto,
  ) {
    return this.userService.getAvailableUsers(userId, dto);
  }

  @Post('/confirm')
  @ApiCreatedResponse({
    type: AuthTokenModel,
  })
  @ApiOperation({
    summary: 'Confirm user sign-up',
  })
  confirmUser(@Body() dto: ConfirmUserDto) {
    return this.userService.confirmUser(dto);
  }

  @Get('/overview/:userId')
  @ApiOkResponse({
    type: [UserModel],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({
    summary: 'Get user overview by userId',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  getUserOverview(
    @Param() paramsDto: UserParamsDto,
    @User() user: DocumentType<UserModel>,
  ): Promise<IUserOverview> {
    return this.userService.getUserOverview(
      paramsDto.userId,
      +user.location.lat,
      +user.location.lng,
    );
  }
}
