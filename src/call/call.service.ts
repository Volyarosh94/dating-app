import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { mongoose } from '@typegoose/typegoose';

import { CallModel } from './models/call.model';
import { CreateCallDto } from './dto/create-call.dto';
import { ScheduleService } from '../schedule/schedule.service';
import { ErrorMessagesEnum } from '../common/enums/error-messages.enum';
import { UpdateCallDto } from './dto/update-call.dto';
import { GetCallsQueryDto } from './dto/get-calls-query.dto';
import { TwilioService } from '../common/services/twilio.service';
import { UserModel } from '../user/models/user.model';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypeEnum } from '../notification/enums/notification-type.enum';
import { ScheduleStatusEnum } from '../schedule/enums/schedule-status.enum';

@Injectable()
export class CallService {
  constructor(
    @InjectModel(CallModel) private callModel: ModelType<CallModel>,
    private scheduleService: ScheduleService,
    private twilioService: TwilioService,
    private notificationService: NotificationService,
  ) {}

  getUserCalls(currentUserId: string, query: GetCallsQueryDto = {}) {
    const { userId, missed, finished } = query;

    const filterObject: mongoose.FilterQuery<CallModel> = {
      $or: [],
    };

    if (userId) {
      filterObject.$or.push(
        {
          'schedule.invited': new mongoose.Types.ObjectId(userId),
        },
        {
          'schedule.creator': new mongoose.Types.ObjectId(userId),
        },
      );
    }

    if (missed) {
      filterObject.missed = missed;
    }

    if (finished) {
      filterObject.finished = finished;
    }

    const { $or, ...filter } = filterObject;

    return this.callModel.aggregate([
      {
        $lookup: {
          from: 'user',
          localField: 'initiator',
          foreignField: '_id',
          as: 'initiator',
        },
      },
      {
        $lookup: {
          from: 'schedule',
          localField: 'schedule',
          foreignField: '_id',
          as: 'schedule',
        },
      },
      { $addFields: { schedule: { $arrayElemAt: ['$schedule', 0] } } },
      { $addFields: { initiator: { $arrayElemAt: ['$initiator', 0] } } },
      {
        $match: {
          ...filter,
          $and: [
            {
              $or: [
                {
                  'schedule.invited': currentUserId,
                },
                {
                  'schedule.creator': currentUserId,
                },
              ],
            },
            ...($or.length
              ? [
                  {
                    $or: [...$or],
                  },
                ]
              : []),
          ],
        },
      },
    ]);
  }

  async getCallByIdOrFail(id: string) {
    const call = await this.callModel
      .findOne({
        _id: id,
      })
      .populate('schedule')
      .populate('initiator');

    if (!call) {
      throw new NotFoundException(ErrorMessagesEnum.CALL);
    }

    return call;
  }

  async createCall(user: DocumentType<UserModel>, dto: CreateCallDto) {
    const { scheduleId } = dto;

    const schedule = await this.scheduleService.getActiveSchedule(
      scheduleId,
      user._id,
    );

    const callExists = await this.callModel.findOne({
      schedule: scheduleId,
      missed: false,
    });

    if (callExists) {
      throw new BadRequestException(ErrorMessagesEnum.CALL.EXISTS);
    }

    const call = await this.callModel.create({
      schedule: scheduleId,
      initiator: user._id,
    });

    const twilio = await this.twilioService.createVideoCall(
      scheduleId,
      `${user.info.firstName} ${user.info.lastName}`,
    );

    await this.scheduleService.updateSchedule(user._id, scheduleId, {
      status: ScheduleStatusEnum.PASSED,
    });

    const invitedUserId =
      schedule.creator === user._id ? user._id : schedule.invited;

    await this.notificationService.sendPushNotification(
      invitedUserId,
      NotificationTypeEnum.INCOMING_CALLS,
      {
        title: 'Incoming call',
        userId: invitedUserId,
        ...schedule,
        ...call,
      },
    );

    return {
      call,
      twilio,
    };
  }

  async updateCall(userId: string, callId: string, dto: UpdateCallDto) {
    const call = await this.getCallByIdOrFail(callId);

    await this.scheduleService.getActiveSchedule(
      call.schedule._id,
      userId,
      false,
    );

    await this.callModel.findOneAndUpdate(
      {
        _id: callId,
      },
      {
        ...dto,
      },
    );

    return {
      success: true,
    };
  }
}
