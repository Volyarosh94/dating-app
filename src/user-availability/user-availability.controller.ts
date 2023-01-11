import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { AuthGuard } from '../common/guards/auth.guard';
import { UserAvailabilityDayModel } from './models/user-availability-day.model';
import { UserAvailabilityService } from './user-availability.service';
import { User } from '../user/decorators/user.decorator';
import { SuccessMessageResponseDto } from '../common/dto/success-message-response.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Controller('/user-availability')
@ApiTags('Availability')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UserAvailabilityController {
  constructor(private availabilityService: UserAvailabilityService) {}

  @Get()
  @ApiOkResponse({
    type: [UserAvailabilityDayModel],
  })
  @ApiOperation({
    summary: 'Get user availability days',
  })
  getAvailability(@User('_id') userId: string) {
    return this.availabilityService.getUserAvailability(userId);
  }

  @Patch()
  @ApiOkResponse({
    type: SuccessMessageResponseDto,
  })
  @ApiOperation({
    summary: 'Update user availability days',
  })
  updateAvailability(
    @User('_id') userId: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.availabilityService.updateAvailability(userId, dto);
  }
}
