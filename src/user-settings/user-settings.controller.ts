import { Body, Controller, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserSettingsModel } from './models/user-settings.model';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { DocumentType } from '@typegoose/typegoose/lib/types';
import { UserModel } from '../user/models/user.model';
import { UpdateNotificationsDto } from './dto/update-notifications.dto';
import { UserSettingsService } from './user-settings.service';

@Controller('/user-settings')
@ApiTags('User settings')
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UserSettingsController {
  constructor(private userSettingsService: UserSettingsService) {}

  @Patch('/notifications')
  @ApiOkResponse({
    type: UserSettingsModel,
  })
  @ApiOperation({
    summary: 'Update user notifications settings',
  })
  updateNotifications(
    @User() user: DocumentType<UserModel>,
    @Body() dto: UpdateNotificationsDto,
  ) {
    return this.userSettingsService.updateSettings(user.settings._id, dto);
  }
}
