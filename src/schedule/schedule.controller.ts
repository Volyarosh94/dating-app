import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ScheduleModel } from './models/schedule.model';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { ScheduleService } from './schedule.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { User } from '../user/decorators/user.decorator';
import { GetSchedulesDto } from './dto/get-schedules.dto';
import { SuccessMessageResponseDto } from '../common/dto/success-message-response.dto';
import { ScheduleParamsDto } from './dto/schedule-params.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('/schedule')
@ApiTags('Schedule')
@UseGuards(AuthGuard)
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBearerAuth()
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Post()
  @ApiCreatedResponse({
    type: ScheduleModel,
  })
  @ApiOperation({
    summary: 'Create schedule',
  })
  createSchedule(@Body() dto: CreateScheduleDto, @User('_id') userId: string) {
    return this.scheduleService.createSchedule(userId, dto);
  }

  @Post('/all')
  @ApiCreatedResponse({
    type: [ScheduleModel],
  })
  @ApiOperation({
    summary: 'Get schedules list',
  })
  getSchedules(@User('_id') userId: string, @Body() query: GetSchedulesDto) {
    return this.scheduleService.getSchedules(userId, query);
  }

  @Patch('/:scheduleId')
  @ApiOkResponse({
    type: SuccessMessageResponseDto,
  })
  @ApiOperation({
    summary: 'Update schedule by scheduleId',
  })
  updateSchedule(
    @User('_id') userId: string,
    @Param() paramsDto: ScheduleParamsDto,
    @Body() dto: UpdateScheduleDto,
  ) {
    return this.scheduleService.updateSchedule(
      userId,
      paramsDto.scheduleId,
      dto,
    );
  }

  @Delete('/:scheduleId')
  @ApiOkResponse({
    type: SuccessMessageResponseDto,
  })
  @ApiOperation({
    summary: 'Delete schedule by scheduleId',
  })
  deleteSchedule(
    @User('_id') userId: string,
    @Param() paramsDto: ScheduleParamsDto,
  ) {
    return this.scheduleService.deleteSchedule(userId, paramsDto.scheduleId);
  }
}
