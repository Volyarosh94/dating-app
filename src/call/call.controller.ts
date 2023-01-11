import {
  Body,
  Controller,
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
import { DocumentType } from '@typegoose/typegoose/lib/types';

import { CallModel } from './models/call.model';
import { CallService } from './call.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CreateCallDto } from './dto/create-call.dto';
import { User } from '../user/decorators/user.decorator';
import { SuccessMessageResponseDto } from '../common/dto/success-message-response.dto';
import { CallParamsDto } from './dto/call-params.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { GetCallsQueryDto } from './dto/get-calls-query.dto';
import { UserModel } from '../user/models/user.model';

@Controller('/call')
@ApiTags('Call')
@UseGuards(AuthGuard)
@ApiBadRequestResponse({ description: 'Bad request' })
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiBearerAuth()
export class CallController {
  constructor(private callService: CallService) {}

  @Post('/all')
  @ApiCreatedResponse({
    type: [CallModel],
  })
  @ApiOperation({
    summary: 'Get calls list',
  })
  getCalls(@User('_id') userId: string, @Body() query: GetCallsQueryDto) {
    return this.callService.getUserCalls(userId, query);
  }

  @Post()
  @ApiCreatedResponse({
    type: CallModel,
  })
  @ApiOperation({
    summary: 'Create call',
  })
  createCall(
    @Body() dto: CreateCallDto,
    @User() user: DocumentType<UserModel>,
  ) {
    return this.callService.createCall(user, dto);
  }

  @Patch('/:callId')
  @ApiOkResponse({
    type: SuccessMessageResponseDto,
  })
  @ApiOperation({
    summary: 'Update call by callId',
  })
  updateCall(
    @User('_id') userId: string,
    @Param() { callId }: CallParamsDto,
    @Body() dto: UpdateCallDto,
  ) {
    return this.callService.updateCall(userId, callId, dto);
  }
}
