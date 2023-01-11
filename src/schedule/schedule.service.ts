import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { DocumentType, ModelType } from '@typegoose/typegoose/lib/types';
import { mongoose } from '@typegoose/typegoose';

import { ScheduleModel } from './models/schedule.model';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UserService } from '../user/user.service';
import { ErrorMessagesEnum } from '../common/enums/error-messages.enum';
import { GetSchedulesDto } from './dto/get-schedules.dto';
import { MongooseService } from '../common/services/mongoose.service';
import { SortOrderEnum } from '../common/enums/sort-order.enum';
import { NotificationService } from '../notification/notification.service';
import { NotificationTypeEnum } from '../notification/enums/notification-type.enum';
import { ScheduleStatusEnum } from './enums/schedule-status.enum';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectModel(ScheduleModel)
    private scheduleModel: ModelType<ScheduleModel>,
    private userService: UserService,
    private mongooseService: MongooseService,
    private notificationService: NotificationService,
  ) {}

  async createSchedule(creatorId: string, dto: CreateScheduleDto) {
    const { time, userId, date, suggestions } = dto;

    await this.userService.getUserByIdOrFail(userId);

    await this.checkScheduleTimeAvailability(
      creatorId,
      date,
      time,
      suggestions,
    );

    const schedule = await this.scheduleModel.create({
      creator: creatorId,
      date,
      time,
      invited: userId,
      suggestions,
    });

    await this.notificationService.sendPushNotification(
      userId,
      NotificationTypeEnum.NEW_INVITES,
      {
        ...schedule,
        title: 'New invite!',
        userId,
      },
    );
    await this.notificationService.sendEmailNotification(
      userId,
      NotificationTypeEnum.NEW_INVITES,
      {
        notificationMessage: 'New invite!',
      },
    );

    return schedule;
  }

  async checkScheduleTimeAvailability(
    userId: string,
    date: string | Date,
    time: string,
    suggestions: string[] = [],
  ) {
    if (!time) {
      const schedule = await this.scheduleModel.findOne({
        creator: userId,
        date,
        suggestions: {
          $in: suggestions,
        },
        status: {
          $ne: ScheduleStatusEnum.PASSED,
        },
      });

      if (schedule) {
        throw new ForbiddenException(ErrorMessagesEnum.SCHEDULE.BUSY_TIME);
      }

      return;
    }

    const schedule = await this.scheduleModel.findOne({
      creator: userId,
      date,
      $or: [
        {
          time,
        },
        {
          ...(suggestions && {
            suggestions: {
              $in: suggestions,
            },
          }),
        },
      ],
      status: {
        $ne: ScheduleStatusEnum.PASSED,
      },
    });

    if (schedule) {
      throw new ForbiddenException(ErrorMessagesEnum.SCHEDULE.BUSY_TIME);
    }

    return schedule;
  }

  async getSchedules(userId: string, query: GetSchedulesDto = {}) {
    const {
      to,
      userId: user,
      created,
      status,
      from,
      review,
      sortOrder = SortOrderEnum.ASC,
      sortBy = ['createdAt'],
    } = query;

    const userField = created ? 'creator' : 'invited';

    const filter: mongoose.FilterQuery<DocumentType<ScheduleModel>> = {};
    const schedulesSorting = {};
    const schedulesOrder = this.mongooseService.getOrder(sortOrder);

    sortBy?.forEach((item) => {
      schedulesSorting[item] = schedulesOrder;
    });

    if (status) {
      filter.status = status;
    }

    if (review) {
      filter.review = review;
    }

    if (from) {
      filter.createdAt = {
        $gte: from,
      };
    }

    if (to) {
      filter.createdAt = {
        $lte: to,
      };
    }

    if (user) {
      filter.$or = [
        {
          creator: user,
        },
        {
          invited: user,
        },
      ];
    }

    return this.scheduleModel.aggregate([
      {
        $match: {
          [userField]: userId,
          ...filter,
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'invited',
          foreignField: '_id',
          as: 'invited',
        },
      },
      {
        $lookup: {
          from: 'user',
          localField: 'creator',
          foreignField: '_id',
          as: 'creator',
        },
      },
      {
        $sort: {
          ...schedulesSorting,
        },
      },
      { $addFields: { creator: { $arrayElemAt: ['$creator', 0] } } },
      { $addFields: { invited: { $arrayElemAt: ['$invited', 0] } } },
    ]);
  }

  async updateSchedule(
    userId: string,
    scheduleId: string,
    dto: Partial<DocumentType<ScheduleModel>>,
  ) {
    const schedule = await this.checkUserSchedule(userId, scheduleId);

    if (dto.time && dto.time !== schedule.time) {
      await this.checkScheduleTimeAvailability(
        userId,
        schedule.date,
        dto.time,
        [dto.time],
      );
    }

    const { creator, invited } = schedule;
    const notificationUserId =
      creator.toString() === userId.toString()
        ? invited.toString()
        : creator.toString();

    await this.notificationService.sendPushNotification(
      notificationUserId,
      NotificationTypeEnum.UPDATES,
      {
        title: 'Schedule updated!',
        data: {
          ...dto,
        },
      },
    );
    await this.notificationService.sendEmailNotification(
      notificationUserId,
      NotificationTypeEnum.UPDATES,
      {
        notificationMessage: 'Schedule updated!',
        ...dto,
      },
    );

    return this.scheduleModel.findOneAndUpdate(
      {
        _id: scheduleId,
      },
      {
        ...dto,
      },
      {
        new: true,
      },
    );
  }

  async deleteSchedule(userId: string, scheduleId: string) {
    await this.checkUserSchedule(userId, scheduleId);

    await this.scheduleModel.findOneAndDelete({
      _id: scheduleId,
    });

    return {
      success: true,
    };
  }

  async checkUserSchedule(userId: string, scheduleId: string) {
    const schedule = await this.scheduleModel.findOne({
      _id: scheduleId,
      $or: [
        {
          creator: userId,
        },
        {
          invited: userId,
        },
      ],
    });

    if (!schedule) {
      throw new ForbiddenException(ErrorMessagesEnum.COMMON.PERMISSION_DENIED);
    }

    return schedule;
  }

  async getActiveSchedule(scheduleId: string, userId: string, withDate = true) {
    const schedule = await this.scheduleModel.findOne({
      _id: scheduleId,
      $or: [
        {
          creator: userId,
        },
        {
          invited: userId,
        },
      ],
      ...(withDate && {
        date: {
          $gte: new Date().toISOString(),
        },
      }),
    });

    if (!schedule) {
      throw new BadRequestException(ErrorMessagesEnum.SCHEDULE.EXPIRED);
    }

    return schedule;
  }
}
