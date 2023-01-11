import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';

import { UserAvailabilityModel } from './models/user-availability.model';
import { DaysEnum } from './enums/days.enum';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';

@Injectable()
export class UserAvailabilityService {
  constructor(
    @InjectModel(UserAvailabilityModel)
    private userAvailabilityModel: ModelType<UserAvailabilityModel>,
  ) {}

  async createDefaultAvailability(userId: string) {
    return this.userAvailabilityModel.create({
      user: userId,
      days: Object.values(DaysEnum).map((dayItem) => {
        return {
          label: dayItem,
          from: '09:00 AM',
          to: '05:00 PM',
        };
      }),
    });
  }

  async getUserAvailability(userId: string) {
    const availability = await this.userAvailabilityModel.findOne({
      user: userId,
    });

    return availability?.days;
  }

  async updateAvailability(userId: string, dto: UpdateAvailabilityDto) {
    const { from, to, day } = dto;

    await this.userAvailabilityModel.findOneAndUpdate(
      {
        user: userId,
        days: {
          $elemMatch: {
            label: day,
          },
        },
      },
      {
        $set: {
          'days.$.from': from,
          'days.$.to': to,
        },
      },
    );

    return {
      success: true,
    };
  }
}
